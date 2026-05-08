import numpy as np
import cv2
from skimage import exposure, feature
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, BatchNormalization, ReLU, MaxPooling2D, Flatten, Dense
from dotenv import load_dotenv
import os

load_dotenv()

EYE_DISEASE_INFO = {
    "Normal": {
        "status": "healthy",
        "recommendation": "Your eyes appear healthy! Keep maintaining good eye health:",
        "precautions": [
            "Follow 20-20-20 rule — every 20 mins look 20 feet away for 20 seconds",
            "Wear UV-protective sunglasses outdoors",
            "Get eye examination every 1-2 years",
            "Maintain proper screen brightness and distance (50-70cm from screen)",
            "Eat foods rich in Vitamin A, C, E and Omega-3 (carrots, spinach, fish)"
        ],
        "treatment": [],
        "medicines": [],
        "additional_info": "Regular eye checkups can detect problems early. Even with no symptoms, annual eye exams are recommended after age 40."
    },
    "Cataract": {
        "status": "disease",
        "recommendation": "Cataract detected. Consult an ophthalmologist soon:",
        "precautions": [
            "Wear sunglasses with UV protection to slow progression",
            "Use bright lighting for reading",
            "Avoid driving at night if vision is blurry",
            "Do not rub eyes",
            "Regular monitoring every 6 months"
        ],
        "treatment": [
            "Early stage: stronger glasses or magnifying lenses may help",
            "Surgery (Phacoemulsification) is the definitive treatment",
            "Intraocular lens (IOL) implant replaces cloudy lens",
            "Surgery is safe, quick (15-20 mins) with high success rate",
            "Vision usually recovers within few days post surgery"
        ],
        "medicines": [
            "Carboxymethylcellulose eye drops — for dry eye relief (OTC)",
            "Vitamin C and E supplements — may slow cataract progression (OTC)",
            "No medicine reverses cataracts — surgery is the only cure",
            "Pilocarpine drops — prescribed by doctor for pupil management (prescription)"
        ],
        "additional_info": "Cataract causes clouding of the eye lens, leading to blurry, faded vision. Most common in people above 60. Diabetes and prolonged steroid use increases risk."
    },
    "Diabetes": {
        "status": "disease",
        "recommendation": "Diabetic eye disease (Diabetic Retinopathy) detected. Urgent ophthalmologist visit needed:",
        "precautions": [
            "Control blood sugar levels strictly (HbA1c below 7%)",
            "Control blood pressure (below 130/80 mmHg)",
            "Quit smoking immediately — worsens retinal damage",
            "Get dilated eye exam every 6 months",
            "Avoid heavy exercise if advanced retinopathy is present"
        ],
        "treatment": [
            "Laser photocoagulation — seals leaking blood vessels in retina",
            "Anti-VEGF injections (Ranibizumab, Bevacizumab) — reduce abnormal vessel growth",
            "Vitrectomy surgery — for advanced cases with vitreous bleeding",
            "Strict diabetes management is the primary treatment",
            "Regular retinal photography to monitor progression"
        ],
        "medicines": [
            "Ranibizumab (Lucentis) injection — anti-VEGF, injected into eye by doctor (prescription)",
            "Bevacizumab (Avastin) — off-label anti-VEGF injection (prescription)",
            "Metformin — for underlying diabetes control (prescription)",
            "Aspirin 75mg — for cardiovascular protection in diabetics (prescription)",
            "Lutein + Zeaxanthin supplements — supports retinal health (OTC)"
        ],
        "additional_info": "Diabetic retinopathy is damage to retinal blood vessels caused by high blood sugar. Leading cause of blindness in working-age adults. Early detection and blood sugar control can prevent vision loss."
    },
    "Glaucoma": {
        "status": "disease",
        "recommendation": "Glaucoma detected. See an ophthalmologist urgently — vision loss from glaucoma is irreversible:",
        "precautions": [
            "Never miss prescribed eye drop doses",
            "Sleep with head slightly elevated",
            "Avoid heavy lifting and strenuous exercise",
            "Limit caffeine intake",
            "Regular IOP (intraocular pressure) monitoring"
        ],
        "treatment": [
            "Eye drops to reduce intraocular pressure (first line treatment)",
            "Laser trabeculoplasty — improves fluid drainage from eye",
            "Trabeculectomy surgery — creates new drainage channel",
            "Glaucoma drainage implants for advanced cases",
            "Lifelong treatment and monitoring required"
        ],
        "medicines": [
            "Timolol 0.5% eye drops — reduces fluid production (prescription)",
            "Latanoprost 0.005% eye drops — increases fluid drainage (prescription)",
            "Brimonidine eye drops — reduces eye pressure (prescription)",
            "Acetazolamide tablets — reduces fluid production (prescription)",
            "Combination drops (Xalacom, Combigan) — prescribed for better compliance"
        ],
        "additional_info": "Glaucoma is increased pressure inside the eye damaging the optic nerve. Called 'silent thief of sight' as it has no symptoms until advanced. Cannot be cured but can be controlled."
    },
    "Hypertension": {
        "status": "disease",
        "recommendation": "Hypertensive Retinopathy detected. Control blood pressure immediately:",
        "precautions": [
            "Monitor blood pressure daily",
            "Reduce salt intake (less than 5g per day)",
            "Avoid stress — practice meditation and deep breathing",
            "Exercise regularly — 30 mins walking daily",
            "Reduce alcohol and quit smoking"
        ],
        "treatment": [
            "Primarily treat underlying hypertension with antihypertensive medicines",
            "Regular dilated eye exams every 6 months",
            "Laser treatment if retinal blood vessels are severely damaged",
            "Treating associated conditions like diabetes if present",
            "Retinal damage may partially reverse with good BP control"
        ],
        "medicines": [
            "Amlodipine 5mg — calcium channel blocker for BP (prescription)",
            "Losartan 50mg — ARB for blood pressure control (prescription)",
            "Atenolol 50mg — beta blocker for BP (prescription)",
            "Aspirin 75mg — prevents blood clots in retinal vessels (prescription)",
            "Omega-3 fish oil — supports vascular health (OTC)"
        ],
        "additional_info": "Hypertensive retinopathy is damage to retinal blood vessels due to high blood pressure. Controlling BP below 130/80 mmHg is the most effective treatment for the eyes."
    },
    "Myopia": {
        "status": "disease",
        "recommendation": "Myopia (Nearsightedness) detected. Consult an eye specialist for corrective measures:",
        "precautions": [
            "Spend at least 2 hours outdoors daily — natural light slows myopia progression",
            "Maintain 50-70cm distance from screens",
            "Take screen breaks every 20-30 minutes",
            "Ensure good lighting while reading",
            "Avoid reading in moving vehicles"
        ],
        "treatment": [
            "Corrective glasses or contact lenses (most common)",
            "Orthokeratology (Ortho-K) — special lenses worn at night",
            "LASIK surgery — permanent correction for eligible patients",
            "Atropine eye drops — slows progression in children",
            "Regular eye checkups every 6-12 months to update prescription"
        ],
        "medicines": [
            "Atropine 0.01% eye drops — slows myopia progression in children (prescription)",
            "Lubricating eye drops (Systane, Refresh) — for contact lens dryness (OTC)",
            "Vitamin D supplements — low levels linked to myopia progression (OTC)",
            "Omega-3 supplements — supports overall eye health (OTC)"
        ],
        "additional_info": "Myopia occurs when eyeball is too long, causing distant objects to appear blurry. Extremely common and increasing worldwide due to screen time. LASIK can permanently correct it in adults."
    },
    "Age Issues": {
        "status": "disease",
        "recommendation": "Age-related Macular Degeneration (AMD) detected. See a retinal specialist soon:",
        "precautions": [
            "Quit smoking — single biggest risk factor for AMD progression",
            "Wear sunglasses with blue light and UV protection",
            "Eat leafy greens, fish and colorful vegetables daily",
            "Monitor vision daily with Amsler grid",
            "Control blood pressure and cholesterol"
        ],
        "treatment": [
            "Dry AMD: no cure, but AREDS2 supplements slow progression",
            "Wet AMD: Anti-VEGF injections are highly effective",
            "Photodynamic therapy (PDT) for certain wet AMD cases",
            "Low vision aids (magnifiers, special lenses) for advanced cases",
            "Regular retinal OCT scans to monitor macula"
        ],
        "medicines": [
            "Ranibizumab (Lucentis) — anti-VEGF injection for wet AMD (prescription)",
            "Aflibercept (Eylea) — anti-VEGF injection (prescription)",
            "AREDS2 formula — Vit C, E, Zinc, Lutein, Zeaxanthin supplement (OTC)",
            "Lutein 20mg + Zeaxanthin 4mg — protects macula from light damage (OTC)",
            "Omega-3 DHA supplements — supports retinal cell health (OTC)"
        ],
        "additional_info": "AMD affects the macula (central part of retina), causing central vision loss. Wet AMD progresses fast but responds well to anti-VEGF injections. Dry AMD progresses slowly over years."
    },
    "Other": {
        "status": "disease",
        "recommendation": "An eye condition has been detected. Please consult an ophthalmologist for accurate diagnosis:",
        "precautions": [
            "Do not ignore any vision changes — blurring, floaters, flashes",
            "Avoid rubbing eyes",
            "Protect eyes from dust and UV with proper eyewear",
            "Get a comprehensive dilated eye exam",
            "Maintain good hygiene — wash hands before touching eyes"
        ],
        "treatment": [
            "Comprehensive eye examination needed for specific diagnosis",
            "Treatment depends on the specific condition identified",
            "Early treatment gives best outcomes for most eye diseases",
            "Follow all instructions from your ophthalmologist",
            "Regular follow-ups are essential"
        ],
        "medicines": [
            "Lubricating eye drops (Refresh, Systane) — general eye comfort (OTC)",
            "Do not use any prescription eye drops without doctor advice",
            "Vitamin A 10000 IU — supports overall eye health (OTC)",
            "Bilberry extract — antioxidant for eye health (OTC)"
        ],
        "additional_info": "Various eye conditions can affect vision. An ophthalmologist can perform detailed tests like slit lamp examination, OCT scan and fundus photography to diagnose accurately."
    }
}

class EyeDisease:
    def __init__(self, num_classes=8, img_size=224):
        self.img_size = img_size
        self.num_classes = num_classes
        self.model = self.load_Model()
        self.clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        self.reference_image = self.load_reference_image(os.getenv("IMAGE_PATH"))
        self.disease_classes = [
            "Normal", "Cataract", "Diabetes", "Glaucoma",
            "Hypertension", "Myopia", "Age Issues", "Other"
        ]

    def load_reference_image(self, reference_image_path: str) -> np.ndarray:
        reference_image = cv2.imread(reference_image_path)
        br, gr, rr = cv2.split(reference_image)
        reference_image = cv2.merge([self.clahe.apply(br), self.clahe.apply(gr), self.clahe.apply(rr)])
        return reference_image
    
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        b, g, r = cv2.split(image)
        image = cv2.merge([self.clahe.apply(b), self.clahe.apply(g), self.clahe.apply(r)])
        matched_image = exposure.match_histograms(image, self.reference_image)
        matched_image = np.uint8(matched_image)
        median_filtered_image = cv2.medianBlur(matched_image, 5)
        bm, gm, rm = cv2.split(median_filtered_image)
        clahe_image = cv2.merge([self.clahe.apply(bm), self.clahe.apply(gm), self.clahe.apply(rm)])
        clahe_image = cv2.cvtColor(clahe_image, cv2.COLOR_BGR2RGB)
        return clahe_image

    def extract_features(self, image: np.ndarray, block_size: tuple=(64, 64), P: int=8, R: int=1) -> np.ndarray:
        resized_image = cv2.resize(image, (self.img_size, self.img_size))
        blocks = [resized_image[i:i+block_size[0], j:j+block_size[1]]
                  for i in range(0, resized_image.shape[0], block_size[0])
                  for j in range(0, resized_image.shape[1], block_size[1])]
        concatenated_features = np.array([])
        for block in blocks:
            for channel in range(3):
                channel_block = block[:, :, channel]
                ulbp_features_channel = feature.local_binary_pattern(channel_block, P, R, method='uniform')
                ulbp_features_flat_channel = ulbp_features_channel.flatten()
                concatenated_features = np.concatenate((concatenated_features, ulbp_features_flat_channel))
        return concatenated_features

    def load_Model(self) -> Sequential:
        model = Sequential()
        model.add(Conv2D(8, (1, 5), strides=(1, 1), padding='same', input_shape=(self.img_size, self.img_size, 3)))
        model.add(BatchNormalization())
        model.add(ReLU())
        model.add(MaxPooling2D(pool_size=(1, 2), strides=(2, 2), padding='valid'))
        model.add(Conv2D(16, (1, 5), strides=(1, 1), padding='same'))
        model.add(BatchNormalization())
        model.add(ReLU())
        model.add(MaxPooling2D(pool_size=(1, 2), strides=(2, 2), padding='valid'))
        model.add(Conv2D(8, (1, 5), strides=(1, 1), padding='same'))
        model.add(BatchNormalization())
        model.add(ReLU())
        model.add(MaxPooling2D(pool_size=(1, 2), strides=(2, 2), padding='valid'))
        model.add(Flatten())
        model.add(Dense(100, activation='relu'))
        model.add(Dense(self.num_classes, activation='softmax'))
        model.load_weights(os.getenv("EYE_WEIGHTS_PATH"))
        return model

    def predict(self, image: np.ndarray) -> dict:
        image = self.preprocess_image(image)
        features = self.extract_features(image)
        features = features.reshape((1, self.img_size, self.img_size, 3))
        predictions = self.model.predict(features)
        predicted_class = np.argmax(predictions[0])
        confidence = round(float(np.max(predictions[0]) * 100), 2)
        label = self.disease_classes[predicted_class]

        return {
            "prediction": label,
            "confidence": confidence,
            "prescription": EYE_DISEASE_INFO[label]
        }