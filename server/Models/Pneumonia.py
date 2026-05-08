import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense
from efficientnet.tfkeras import EfficientNetB0
from dotenv import load_dotenv
import os

load_dotenv()

PNEUMONIA_INFO = {
    "No Pneumonia Detected": {
        "status": "healthy",
        "recommendation": "Your lungs appear healthy! Here are some tips to keep them that way:",
        "precautions": [
            "Avoid smoking and second-hand smoke exposure",
            "Exercise regularly — 30 mins of cardio daily strengthens lung capacity",
            "Stay hydrated — drink 8-10 glasses of water daily",
            "Avoid air pollution and wear mask in dusty environments",
            "Get annual flu vaccine to prevent respiratory infections"
        ],
        "treatment": [],
        "medicines": [],
        "additional_info": "Healthy lungs, free of infection. Maintain good respiratory hygiene by covering mouth while sneezing/coughing."
    },
    "Pneumonia Detected": {
        "status": "disease",
        "recommendation": "Pneumonia detected. Please consult a doctor immediately. Until then:",
        "precautions": [
            "Rest completely — avoid physical exertion",
            "Stay in a warm, well-ventilated room",
            "Avoid contact with others to prevent spreading infection",
            "Do not smoke or expose yourself to smoke",
            "Monitor your oxygen levels if possible (SpO2 should be above 95%)"
        ],
        "treatment": [
            "Doctor will likely prescribe antibiotics (bacterial) or antivirals (viral)",
            "Oxygen therapy may be needed if breathing is difficult",
            "Chest physiotherapy helps clear mucus from lungs",
            "Hospitalization may be required for severe cases",
            "Follow-up chest X-ray after 4-6 weeks to confirm recovery"
        ],
        "medicines": [
            "Azithromycin 500mg — common antibiotic for community-acquired pneumonia (prescription required)",
            "Amoxicillin-Clavulanate 625mg — broad spectrum antibiotic (prescription required)",
            "Paracetamol 500mg — for fever and body pain relief (OTC)",
            "Guaifenesin syrup — expectorant to loosen mucus (OTC)",
            "Salbutamol inhaler — if wheezing or breathing difficulty (prescription required)"
        ],
        "additional_info": "Pneumonia is inflammation of lung tissue caused by bacteria, virus or fungi. Bacterial pneumonia responds well to antibiotics. Never self-medicate antibiotics without doctor consultation."
    }
}

class Pneumonia:
    def __init__(self, image_size=256) -> None:
        self.img_size = image_size
        self.model = self.load_Model()
    
    def load_Model(self) -> Sequential:
        model = Sequential()
        base = EfficientNetB0(
            input_shape=(self.img_size, self.img_size, 3),
            weights=None,
            include_top=False
        )
        model.add(base)
        model.add(GlobalAveragePooling2D())
        model.add(Dense(1, activation='sigmoid'))
        weights_path = os.getenv("PNEUMONIA_WEIGHTS_PATH")
        model.load_weights(weights_path)
        return model
    
    def preProcess(self, image: np.ndarray) -> np.array:
        img = image / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    
    def predict(self, image: np.ndarray) -> dict:
        img = self.preProcess(image)
        predictions = self.model.predict(img)
        prob = predictions[0][0]
        predicted_class = ((1-predictions[0]) > 0.25)[0]
        label = "Pneumonia Detected" if predicted_class else "No Pneumonia Detected"
        confidence = round(float((prob) * 100 if predicted_class else prob * 100), 2)
        return {
            "prediction": label,
            "confidence": confidence,
            "prescription": PNEUMONIA_INFO[label]
        }
    