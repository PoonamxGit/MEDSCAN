import numpy as np
import cv2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense
from tensorflow.keras.applications import ResNet50
from dotenv import load_dotenv
import os

load_dotenv()

SKIN_DISEASE_INFO = {
    "Light Diseases and Disorders of Pigmentation": {
        "status": "disease",
        "recommendation": "Pigmentation disorder detected. Consult a dermatologist:",
        "precautions": ["Always apply SPF 30+ sunscreen", "Avoid sun exposure 10am-4pm", "Do not use harsh skin-lightening creams without doctor advice", "Keep skin moisturized", "Wear protective clothing outdoors"],
        "treatment": ["Topical depigmenting agents prescribed by dermatologist", "Chemical peels for stubborn pigmentation", "Laser therapy for resistant cases", "Phototherapy for vitiligo", "Treatment of underlying cause if any"],
        "medicines": ["Hydroquinone 4% cream — skin lightening (prescription)", "Kojic acid cream — reduces melanin production (OTC)", "Niacinamide serum — brightens skin and reduces pigmentation (OTC)", "Tretinoin 0.025% cream — skin renewal (prescription)", "SPF 50 sunscreen — essential daily protection (OTC)"],
        "additional_info": "Pigmentation disorders include vitiligo, melasma and post-inflammatory hyperpigmentation. Sun protection is the most important step in management."
    },
    "Lupus and other Connective Tissue diseases": {
        "status": "disease",
        "recommendation": "Possible lupus or connective tissue disease signs. See a rheumatologist urgently:",
        "precautions": ["Strictly avoid sun exposure — use SPF 50+ always", "Do not skip medications", "Monitor for joint pain, fatigue and fever", "Avoid stress", "Get regular blood tests (ANA, anti-dsDNA)"],
        "treatment": ["Hydroxychloroquine — cornerstone of lupus treatment", "Corticosteroids for flare management", "Immunosuppressants for severe cases", "Regular monitoring of kidneys and blood counts", "Multidisciplinary care (rheumatologist + dermatologist)"],
        "medicines": ["Hydroxychloroquine (Plaquenil) 200mg — anti-malarial for lupus (prescription)", "Prednisolone 10mg — for flares (prescription)", "Sunscreen SPF 50+ — mandatory daily (OTC)", "Calcium + Vitamin D — to prevent steroid-induced bone loss (OTC)", "Azathioprine — immunosuppressant (prescription)"],
        "additional_info": "Lupus is an autoimmune disease where immune system attacks own tissues. Butterfly rash on face is classic sign. Requires lifelong management. Sun avoidance is critical."
    },
    "Acne and Rosacea": {
        "status": "disease",
        "recommendation": "Acne or Rosacea detected. See a dermatologist for proper treatment:",
        "precautions": ["Wash face twice daily with gentle cleanser", "Never pop or squeeze pimples", "Use non-comedogenic (oil-free) moisturizer and sunscreen", "Change pillowcases twice a week", "Avoid spicy food, alcohol and hot beverages (for rosacea)"],
        "treatment": ["Topical retinoids for acne (adapalene, tretinoin)", "Oral antibiotics for moderate-severe acne", "Isotretinoin for severe nodular acne", "Azelaic acid or metronidazole for rosacea", "Laser therapy for rosacea redness and visible vessels"],
        "medicines": ["Benzoyl peroxide 2.5% gel — kills acne bacteria (OTC)", "Adapalene 0.1% gel — topical retinoid (OTC)", "Clindamycin 1% lotion — antibiotic for acne (prescription)", "Doxycycline 100mg — oral antibiotic for acne (prescription)", "Azelaic acid 15% gel — for rosacea and acne (prescription)"],
        "additional_info": "Acne affects hair follicles and oil glands. Rosacea causes facial redness and visible vessels. Both are manageable with consistent treatment. Results take 6-8 weeks."
    },
    "Systemic Disease": {
        "status": "disease",
        "recommendation": "Skin signs of a systemic disease detected. Consult a doctor immediately:",
        "precautions": ["Do not ignore new skin changes with other symptoms", "Monitor for fever, weight loss, fatigue", "Get complete blood work done", "Avoid self-medication", "Document skin changes with photos for doctor"],
        "treatment": ["Treatment of underlying systemic condition is primary", "Dermatologist and physician co-management", "Skin biopsy may be needed for diagnosis", "Symptomatic treatment for skin symptoms", "Regular monitoring and follow-ups"],
        "medicines": ["Do not self-medicate — treatment depends on underlying cause", "Cetirizine 10mg — for itching relief (OTC)", "Calamine lotion — soothing for irritated skin (OTC)", "Emollient moisturizer — skin barrier support (OTC)"],
        "additional_info": "Many internal diseases show signs on skin first — diabetes, thyroid disorders, liver disease, kidney disease. Skin findings can help diagnose underlying conditions."
    },
    "Poison Ivy and other Contact Dermatitis": {
        "status": "disease",
        "recommendation": "Contact Dermatitis detected. Identify and avoid the trigger:",
        "precautions": ["Identify and completely avoid the allergen/irritant", "Wash affected area with soap and water immediately", "Do not scratch — causes infection and scarring", "Wear gloves when handling irritating substances", "Use fragrance-free, hypoallergenic products"],
        "treatment": ["Remove and avoid contact with trigger substance", "Cool compresses for itch relief", "Topical corticosteroids for inflammation", "Oral antihistamines for itching", "Severe cases may need oral steroids"],
        "medicines": ["Hydrocortisone 1% cream — reduces inflammation (OTC)", "Cetirizine 10mg — antihistamine for itch (OTC)", "Calamine lotion — cooling and anti-itch (OTC)", "Clobetasol cream — strong steroid for severe cases (prescription)", "Tacrolimus ointment — non-steroidal for sensitive areas (prescription)"],
        "additional_info": "Contact dermatitis is skin inflammation from direct contact with irritants (soaps, chemicals) or allergens (nickel, latex, plants). Patch testing identifies specific allergens."
    },
    "Vascular Tumors": {
        "status": "disease",
        "recommendation": "Vascular skin lesion detected. Consult a dermatologist for evaluation:",
        "precautions": ["Monitor any growth or color change in lesion", "Do not attempt to remove at home", "Protect from trauma and bleeding", "Take photos monthly to track changes", "See doctor if lesion bleeds, ulcerates or grows rapidly"],
        "treatment": ["Most hemangiomas resolve on their own in children", "Propranolol for infantile hemangiomas", "Laser therapy for superficial vascular lesions", "Surgical excision if needed", "Sclerotherapy for certain vascular malformations"],
        "medicines": ["Propranolol — for infantile hemangiomas (prescription)", "Timolol gel — topical for small superficial hemangiomas (prescription)", "No OTC medicines treat vascular tumors", "Wound care products if lesion is ulcerated (OTC)"],
        "additional_info": "Vascular tumors include hemangiomas and vascular malformations. Most infantile hemangiomas resolve by age 10. Port-wine stains are permanent without laser treatment."
    },
    "Urticaria Hives": {
        "status": "disease",
        "recommendation": "Urticaria (Hives) detected. Identify the trigger and seek treatment:",
        "precautions": ["Identify and avoid triggers (food, medicines, stress, heat)", "Wear loose, breathable cotton clothing", "Avoid hot showers — use lukewarm water", "Keep an allergy diary to track triggers", "Seek emergency care if throat swelling or breathing difficulty occurs"],
        "treatment": ["Antihistamines are first-line treatment", "Oral corticosteroids for severe acute urticaria", "Omalizumab (Xolair) injections for chronic urticaria", "Identify and treat underlying cause", "Epinephrine injection for anaphylaxis (emergency)"],
        "medicines": ["Cetirizine 10mg — non-drowsy antihistamine (OTC)", "Loratadine 10mg — antihistamine (OTC)", "Fexofenadine 180mg — antihistamine (OTC)", "Prednisolone — for severe attacks (prescription)", "Montelukast — add-on for chronic urticaria (prescription)"],
        "additional_info": "Urticaria is raised, itchy welts on skin caused by allergic reaction or other triggers. Acute urticaria resolves within 6 weeks. Chronic urticaria lasts longer and needs specialist care."
    },
    "Atopic Dermatitis": {
        "status": "disease",
        "recommendation": "Atopic Dermatitis (Eczema) detected. Consistent skincare is key:",
        "precautions": ["Moisturize skin at least twice daily, immediately after bath", "Use fragrance-free, dye-free soaps and detergents", "Avoid wool — wear soft cotton clothing", "Keep nails short to prevent scratching damage", "Identify and avoid personal triggers (sweat, dust mites, pet dander)"],
        "treatment": ["Emollient therapy — cornerstone of eczema management", "Topical corticosteroids during flares", "Topical calcineurin inhibitors for sensitive areas", "Dupilumab injections for moderate-severe eczema", "Phototherapy for widespread disease"],
        "medicines": ["Hydrocortisone 1% cream — mild flares (OTC)", "Mometasone cream — moderate flares (prescription)", "Tacrolimus 0.1% ointment — for face and skin folds (prescription)", "Cetaphil or CeraVe moisturizer — daily emollient (OTC)", "Cetirizine 10mg — for itch and sleep (OTC)"],
        "additional_info": "Atopic dermatitis is a chronic inflammatory skin condition often associated with asthma and allergic rhinitis (atopic triad). It is not contagious. Proper moisturizing prevents flares significantly."
    },
    "Bullous Disease": {
        "status": "disease",
        "recommendation": "Bullous (blistering) skin disease detected. See a dermatologist urgently:",
        "precautions": ["Do not pop or puncture blisters — risk of infection", "Keep affected area clean and covered with non-stick dressing", "Avoid friction and trauma to skin", "Eat soft foods if mouth is involved", "Seek urgent care — some bullous diseases are life-threatening"],
        "treatment": ["High-dose corticosteroids are often first-line", "Immunosuppressants (azathioprine, mycophenolate)", "Rituximab for pemphigus vulgaris", "Wound care for open blisters", "Hospitalization for extensive involvement"],
        "medicines": ["Prednisolone — high dose for acute management (prescription)", "Azathioprine — immunosuppressant (prescription)", "Dapsone — for dermatitis herpetiformis and bullous pemphigoid (prescription)", "Antiseptic wound dressings — for open lesions (OTC)", "Do not use OTC creams on open blisters without advice"],
        "additional_info": "Bullous diseases like pemphigus and pemphigoid are serious autoimmune blistering disorders. Dermatitis herpetiformis is linked to celiac disease. Early aggressive treatment prevents complications."
    },
    "Hair Loss Photos Alopecia and other Hair Diseases": {
        "status": "disease",
        "recommendation": "Hair loss condition detected. Consult a dermatologist for diagnosis:",
        "precautions": ["Avoid tight hairstyles (braids, ponytails) that pull hair", "Use mild, sulfate-free shampoos", "Eat protein-rich diet — hair is made of keratin", "Manage stress — major trigger for telogen effluvium", "Get blood tests — check iron, thyroid, Vitamin D, B12"],
        "treatment": ["Minoxidil — topical for androgenetic alopecia", "Finasteride — oral for male pattern baldness", "Steroid injections for alopecia areata", "PRP (Platelet-Rich Plasma) therapy", "Hair transplant for permanent hair loss"],
        "medicines": ["Minoxidil 5% solution or foam — promotes hair growth (OTC)", "Finasteride 1mg — for male pattern baldness (prescription)", "Biotin 10mg supplements — supports hair health (OTC)", "Iron + Folic acid — if deficiency is cause (OTC)", "Triamcinolone injection — for alopecia areata patches (prescription)"],
        "additional_info": "Hair loss can be androgenetic, autoimmune (alopecia areata), nutritional deficiency, or stress-related. Most forms are treatable. Early treatment gives best results. Blood tests help find reversible causes."
    },
    "Tinea Ringworm Candidiasis and other Fungal Infections": {
        "status": "disease",
        "recommendation": "Fungal skin infection detected. Start antifungal treatment:",
        "precautions": ["Keep affected area clean and dry — fungi love moisture", "Do not share towels, clothing or footwear", "Wear loose, breathable cotton clothing", "Change socks daily", "Complete full course of antifungal even if symptoms resolve"],
        "treatment": ["Topical antifungal creams for localized infections", "Oral antifungals for extensive or resistant infections", "Antifungal shampoo for scalp ringworm", "Treat all contacts and pets if ringworm", "Treat underlying conditions (diabetes) that predispose to fungal infections"],
        "medicines": ["Clotrimazole 1% cream — broad spectrum antifungal (OTC)", "Terbinafine 1% cream — for ringworm and athlete's foot (OTC)", "Fluconazole 150mg — oral for candidiasis (prescription)", "Itraconazole 100mg — for nail fungus (prescription)", "Selenium sulfide shampoo — for scalp infections (OTC)"],
        "additional_info": "Fungal skin infections are very common and highly contagious. Tinea affects different body parts — feet (athlete's foot), groin (jock itch), scalp (ringworm). Respond well to antifungal treatment."
    },
    "Psoriasis pictures Lichen Planus and related diseases": {
        "status": "disease",
        "recommendation": "Psoriasis or Lichen Planus detected. See a dermatologist for management:",
        "precautions": ["Moisturize daily to prevent dry skin flares", "Avoid triggers — stress, infections, skin injury, alcohol", "Do not scratch plaques — causes Koebner phenomenon", "Get regular sun exposure (controlled) — helps psoriasis", "Monitor for joint pain — psoriatic arthritis"],
        "treatment": ["Topical corticosteroids and Vitamin D analogues", "Phototherapy (NB-UVB) for widespread disease", "Methotrexate for moderate-severe psoriasis", "Biologics (adalimumab, secukinumab) for severe cases", "Acitretin for pustular psoriasis"],
        "medicines": ["Calcipotriol cream — Vitamin D analogue for psoriasis (prescription)", "Betamethasone cream — potent steroid for plaques (prescription)", "Methotrexate 15mg weekly — for severe psoriasis (prescription)", "Coal tar shampoo — for scalp psoriasis (OTC)", "Hydroxyzine — for itch in lichen planus (prescription)"],
        "additional_info": "Psoriasis is a chronic autoimmune skin disease causing scaly plaques. Lichen planus causes itchy purple flat-topped bumps. Both are manageable but not curable. Biologics have revolutionized psoriasis treatment."
    },
    "Melanoma Skin Cancer Nevi and Moles": {
        "status": "disease",
        "recommendation": "⚠️ Possible melanoma or suspicious mole detected. See a dermatologist URGENTLY — do not delay:",
        "precautions": ["Do not ignore any changing mole — ABCDE rule: Asymmetry, Border, Color, Diameter, Evolution", "Strictly avoid sun tanning and tanning beds", "Apply SPF 50+ sunscreen daily", "Monthly self skin examination", "Family history of melanoma increases risk — regular screening needed"],
        "treatment": ["Surgical excision with clear margins is primary treatment", "Sentinel lymph node biopsy to check spread", "Immunotherapy (pembrolizumab, nivolumab) for advanced melanoma", "Targeted therapy (BRAF inhibitors) if BRAF mutation present", "Radiation therapy for certain cases"],
        "medicines": ["Do not self-treat suspected melanoma — surgery is required", "Pembrolizumab (Keytruda) — immunotherapy (prescription, oncologist)", "Dabrafenib + Trametinib — targeted therapy for BRAF+ melanoma (prescription)", "Sunscreen SPF 50+ — prevention and post-treatment (OTC)", "Vitamin D supplements — supports immune function (OTC)"],
        "additional_info": "⚠️ Melanoma is the most dangerous skin cancer. Early detection is life-saving — 5-year survival is 98% if caught early vs 25% if spread. Any changing mole needs immediate dermatologist evaluation."
    },
    "Nail Fungus and other Nail Disease": {
        "status": "disease",
        "recommendation": "Nail disease detected. Consult a dermatologist for proper diagnosis:",
        "precautions": ["Keep nails clean, short and dry", "Wear flip-flops in public showers and pools", "Do not share nail clippers or files", "Wear moisture-wicking socks", "Avoid nail trauma — use proper footwear"],
        "treatment": ["Topical antifungal nail lacquer for mild cases", "Oral antifungals for moderate-severe nail fungus", "Nail avulsion for severely damaged nails", "Laser treatment for nail fungus", "Treatment for 3-6 months minimum as nails grow slowly"],
        "medicines": ["Amorolfine 5% nail lacquer — topical antifungal (OTC/prescription)", "Terbinafine 250mg daily — oral for nail fungus 3 months (prescription)", "Itraconazole pulse therapy — 1 week per month (prescription)", "Tea tree oil — mild antifungal, supportive (OTC)", "Urea 40% cream — softens thickened nails (OTC)"],
        "additional_info": "Nail fungus (onychomycosis) causes thickened, yellowed, crumbly nails. Treatment is long (3-6 months) as nails grow slowly. Oral treatment is more effective than topical alone."
    },
    "Scabies Lyme Disease and other Infestations and Bites": {
        "status": "disease",
        "recommendation": "Skin infestation or bite reaction detected. Treat promptly and check close contacts:",
        "precautions": ["Wash all clothing, bedding, towels in hot water (60°C)", "Treat all household members simultaneously for scabies", "Avoid close skin contact until treatment complete", "Vacuum furniture and carpets thoroughly", "Check for tick attachment if in wooded areas — Lyme disease risk"],
        "treatment": ["Permethrin 5% cream for scabies — apply head to toe", "Oral ivermectin for crusted (Norwegian) scabies", "Antibiotics (doxycycline) for Lyme disease", "Antihistamines and steroids for insect bite reactions", "Repeat treatment after 1 week for scabies"],
        "medicines": ["Permethrin 5% cream — scabicide applied overnight (prescription)", "Ivermectin 200mcg/kg — oral for scabies (prescription)", "Doxycycline 100mg 21 days — for Lyme disease (prescription)", "Cetirizine 10mg — for itch relief (OTC)", "Calamine lotion — soothing for bite reactions (OTC)"],
        "additional_info": "Scabies is caused by mites burrowing into skin causing intense itch, worse at night. All contacts must be treated simultaneously to prevent reinfection. Lyme disease needs early antibiotic treatment."
    },
    "Eczema Photos": {
        "status": "disease",
        "recommendation": "Eczema detected. Consistent skincare and trigger avoidance is essential:",
        "precautions": ["Moisturize immediately after every bath while skin is damp", "Use lukewarm (not hot) water for bathing", "Avoid known triggers — soaps, detergents, wool, sweat", "Keep home humidity around 45-55%", "Use mild, unscented laundry detergents"],
        "treatment": ["Emollient therapy twice daily — foundation of eczema care", "Topical corticosteroids for active flares", "Tacrolimus or pimecrolimus for maintenance and sensitive areas", "Dupilumab biological injection for severe cases", "Wet wrap therapy for severe acute flares"],
        "medicines": ["CeraVe or Cetaphil moisturizing cream — daily emollient (OTC)", "Hydrocortisone 1% — mild flares (OTC)", "Triamcinolone cream — moderate flares (prescription)", "Tacrolimus 0.03% ointment — face and folds (prescription)", "Cetirizine 10mg — nighttime itch (OTC)"],
        "additional_info": "Eczema is a chronic condition but well manageable. The goal is to keep skin moisturized, avoid triggers and treat flares early. With proper care, many patients have long clear periods."
    },
    "Exanthems and Drug Eruptions": {
        "status": "disease",
        "recommendation": "Drug eruption or viral rash detected. Stop suspected medicine and see a doctor immediately:",
        "precautions": ["Stop the suspected causative drug immediately (consult doctor first)", "Note all medicines taken in last 2-4 weeks", "Do not take the suspected drug again in future", "Seek emergency care if blisters, mucosal involvement or fever present — could be SJS", "Wear medical alert bracelet for known drug allergies"],
        "treatment": ["Withdraw causative drug immediately", "Antihistamines for mild reactions", "Oral steroids for more severe reactions", "Hospitalization for Stevens-Johnson Syndrome", "IV immunoglobulins for toxic epidermal necrolysis"],
        "medicines": ["Cetirizine 10mg — for mild drug rash itch (OTC)", "Prednisolone — for moderate reactions (prescription)", "Do NOT restart suspected culprit drug", "Calamine lotion — soothing for rash (OTC)", "Paracetamol — for associated fever (OTC)"],
        "additional_info": "Drug eruptions range from mild rashes to life-threatening Stevens-Johnson Syndrome. Common culprits: antibiotics (penicillin, sulfa drugs), NSAIDs, anticonvulsants. Always inform doctors about drug allergies."
    },
    "Herpes HPV and other STDs Photos": {
        "status": "disease",
        "recommendation": "Possible STD-related skin condition detected. Consult a doctor confidentially:",
        "precautions": ["Abstain from sexual activity until properly evaluated and treated", "Inform recent partners for testing", "Use condoms consistently", "Do not share personal items (towels, razors)", "Get full STI screening panel done"],
        "treatment": ["Antivirals for herpes (acyclovir, valacyclovir)", "Cryotherapy or topical treatment for HPV warts", "Antibiotics for bacterial STDs (syphilis, gonorrhea)", "HPV vaccine for prevention (best before exposure)", "Regular follow-up and partner treatment essential"],
        "medicines": ["Acyclovir 400mg 3x daily — for herpes simplex (prescription)", "Valacyclovir 500mg — for genital herpes (prescription)", "Imiquimod 5% cream — for HPV warts (prescription)", "Podophyllotoxin 0.5% solution — for warts (prescription)", "Azithromycin 1g single dose — for chlamydia (prescription)"],
        "additional_info": "STD-related skin conditions include herpes (painful blisters), HPV warts (painless growths), syphilis (painless ulcer then rash). All are treatable. Early treatment prevents complications and transmission."
    },
    "Seborrheic Keratoses and other Benign Tumors": {
        "status": "disease",
        "recommendation": "Benign skin growth detected. Consult dermatologist to confirm benign nature:",
        "precautions": ["Monitor for any rapid change in size, color or shape", "Do not attempt to remove at home — risk of infection and scarring", "Protect from sun exposure", "Annual skin check recommended", "Biopsy may be done to confirm benign diagnosis"],
        "treatment": ["Most benign lesions require no treatment", "Cryotherapy (liquid nitrogen) — freezes and removes lesion", "Curettage — scraping off the lesion", "Electrocautery for removal", "Laser removal for cosmetically bothersome lesions"],
        "medicines": ["No specific medicines needed for benign lesions", "Hydrogen peroxide 40% (Eskata) — for seborrheic keratoses (prescription)", "SPF 50+ sunscreen — to prevent new lesions (OTC)", "No OTC creams safely remove skin growths"],
        "additional_info": "Seborrheic keratoses are very common benign growths appearing with age — waxy, stuck-on appearance. They are harmless but can be removed for cosmetic reasons. Always confirm benign nature with dermatologist."
    },
    "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions": {
        "status": "disease",
        "recommendation": "⚠️ Possible precancerous or cancerous skin lesion detected. See a dermatologist URGENTLY:",
        "precautions": ["Immediate dermatologist evaluation is essential", "Strictly avoid all sun exposure — use SPF 50+ always", "Do not attempt to treat at home", "Monthly self skin examination for new lesions", "Annual full body skin check by dermatologist"],
        "treatment": ["Surgical excision with clear margins", "Mohs surgery for high-risk areas (face, ears)", "Cryotherapy for actinic keratoses", "Topical 5-fluorouracil or imiquimod for actinic keratoses", "Radiation therapy if surgery not possible"],
        "medicines": ["5-Fluorouracil 5% cream — for actinic keratoses (prescription)", "Imiquimod 5% cream — immune stimulator for AK and superficial BCC (prescription)", "Diclofenac 3% gel — for actinic keratoses (prescription)", "SPF 50+ sunscreen with zinc oxide — essential prevention (OTC)", "Vismodegib — for advanced basal cell carcinoma (prescription, oncologist)"],
        "additional_info": "⚠️ Actinic keratoses are precancerous; basal cell carcinoma is most common skin cancer — rarely spreads but destroys local tissue. Both are caused by cumulative sun damage. Early treatment is curative."
    },
    "Vasculitis": {
        "status": "disease",
        "recommendation": "Vasculitis detected. Consult a rheumatologist or dermatologist urgently:",
        "precautions": ["Do not stand for long periods if legs are affected", "Elevate legs to reduce swelling", "Avoid cold — worsens some vasculitis", "Monitor for organ involvement — kidney, lungs", "Take prescribed medications regularly"],
        "treatment": ["Corticosteroids are mainstay for most vasculitis", "Immunosuppressants (cyclophosphamide, azathioprine) for severe forms", "Rituximab for ANCA-associated vasculitis", "Treat underlying cause (infection, drug, autoimmune)", "Regular monitoring of kidneys and inflammatory markers"],
        "medicines": ["Prednisolone — first-line for vasculitis (prescription)", "Azathioprine — steroid-sparing immunosuppressant (prescription)", "Cyclophosphamide — for severe systemic vasculitis (prescription)", "Colchicine — for Behcet's disease and some vasculitis (prescription)", "Compression stockings — for leg vasculitis (OTC)"],
        "additional_info": "Vasculitis is inflammation of blood vessels, can affect skin (palpable purpura, ulcers) and internal organs. Ranges from self-limited to life-threatening. Early diagnosis and treatment prevents organ damage."
    },
    "Cellulitis Impetigo and other Bacterial Infections": {
        "status": "disease",
        "recommendation": "Bacterial skin infection detected. Start antibiotic treatment promptly:",
        "precautions": ["Keep infected area clean — wash gently with soap and water", "Do not squeeze or pick at infected skin", "Complete full antibiotic course even if improving", "Cover wound with clean dressing", "Seek emergency care if red streaks spreading, fever or swelling increasing rapidly"],
        "treatment": ["Oral antibiotics for cellulitis and impetigo", "IV antibiotics for severe cellulitis (hospitalization)", "Topical antibiotics for mild impetigo", "Wound debridement if necrotizing infection suspected", "Elevation and rest for limb cellulitis"],
        "medicines": ["Flucloxacillin 500mg — for cellulitis from staph (prescription)", "Co-amoxiclav 625mg — broad spectrum for skin infections (prescription)", "Mupirocin 2% cream — topical for impetigo (prescription)", "Fusidic acid cream — for localized bacterial infection (OTC/prescription)", "Paracetamol 500mg — for fever and pain (OTC)"],
        "additional_info": "Cellulitis is bacterial infection of deep skin layers causing warmth, redness, swelling. Impetigo is superficial bacterial infection common in children — honey-colored crusts. Both respond well to appropriate antibiotics."
    },
    "Warts Molluscum and other Viral Infections": {
        "status": "disease",
        "recommendation": "Viral skin infection detected. Treatment prevents spread:",
        "precautions": ["Do not pick or scratch warts/lesions — spreads virus", "Do not share towels or personal items", "Cover lesions when swimming", "Wash hands frequently", "Children with molluscum can attend school but cover lesions"],
        "treatment": ["Cryotherapy — liquid nitrogen freezing of warts", "Salicylic acid for common warts", "Cantharidin application by dermatologist for molluscum", "Curettage — scraping off molluscum lesions", "Imiquimod cream — immune stimulator for warts"],
        "medicines": ["Salicylic acid 17% solution or gel — for warts (OTC)", "Duofilm — salicylic acid + lactic acid for warts (OTC)", "Imiquimod 5% cream — immune stimulator for warts (prescription)", "Cantharidin — applied in clinic for molluscum (prescription)", "Zinc oxide cream — supportive for molluscum (OTC)"],
        "additional_info": "Warts are caused by HPV, molluscum by poxvirus. Both are contagious through direct contact. Warts on hands/feet often self-resolve in 2 years. Molluscum self-resolves in 6-18 months in immunocompetent people."
    }
}

class SkinDisease:
    def __init__(self, num_classes=23, img_size=224) -> None:
        self.img_size = img_size
        self.num_classes = num_classes
        self.model = self.load_Model()
        self.clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        self.disease_classes = [
            'Light Diseases and Disorders of Pigmentation',
            'Lupus and other Connective Tissue diseases',
            'Acne and Rosacea',
            'Systemic Disease',
            'Poison Ivy and other Contact Dermatitis',
            'Vascular Tumors',
            'Urticaria Hives',
            'Atopic Dermatitis',
            'Bullous Disease',
            'Hair Loss Photos Alopecia and other Hair Diseases',
            'Tinea Ringworm Candidiasis and other Fungal Infections',
            'Psoriasis pictures Lichen Planus and related diseases',
            'Melanoma Skin Cancer Nevi and Moles',
            'Nail Fungus and other Nail Disease',
            'Scabies Lyme Disease and other Infestations and Bites',
            'Eczema Photos',
            'Exanthems and Drug Eruptions',
            'Herpes HPV and other STDs Photos',
            'Seborrheic Keratoses and other Benign Tumors',
            'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions',
            'Vasculitis',
            'Cellulitis Impetigo and other Bacterial Infections',
            'Warts Molluscum and other Viral Infections'
        ]
    
    def load_Model(self) -> Model:
        base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(self.img_size, self.img_size, 3))
        x = GlobalAveragePooling2D()(base_model.output)
        x = Dense(512, activation='relu')(x)
        predictions = Dense(self.num_classes, activation='softmax')(x)
        model = Model(inputs=base_model.input, outputs=predictions)
        model.load_weights(os.getenv("SKIN_WEIGHTS_PATH"))
        return model

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        b, g, r = cv2.split(image)
        image = cv2.merge([self.clahe.apply(b), self.clahe.apply(g), self.clahe.apply(r)])
        median_filtered_image = cv2.medianBlur(image, 5)
        bm, gm, rm = cv2.split(median_filtered_image)
        clahe_image = cv2.merge([self.clahe.apply(bm), self.clahe.apply(gm), self.clahe.apply(rm)])
        clahe_image = cv2.cvtColor(clahe_image, cv2.COLOR_BGR2RGB)
        clahe_image = cv2.resize(clahe_image, (self.img_size, self.img_size))
        clahe_image = np.expand_dims(clahe_image, axis=0)
        return clahe_image
    
    def predict(self, image: np.ndarray) -> dict:
        img = self.preprocess_image(image)
        predictions = self.model.predict(img)
        predicted_class = np.argmax(predictions[0])
        confidence = round(float(np.max(predictions[0]) * 100), 2)
        label = self.disease_classes[predicted_class]

        return {
            "prediction": label,
            "confidence": confidence,
            "prescription": SKIN_DISEASE_INFO[label]
        }