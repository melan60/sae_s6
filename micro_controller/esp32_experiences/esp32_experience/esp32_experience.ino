const int yellowPin = 5;      // Broche de la LED jaune
const int buttonPin = 19;     // Broche du bouton
const int greenLedPin = 23;   // Broche de la LED verte
const int redLedPin = 18;     // Broche de la LED rouge
const int buzzerPin = 13;     // Broche du buzzer

unsigned long startTime = 0;   // Variable pour stocker le temps de démarrage du chronomètre
boolean chronometerRunning = false; // Indique si le chronomètre est en cours d'exécution

char test;
int randomLedPin;

void setup() {
  Serial.begin(115200);
  pinMode(yellowPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  noTone(buzzerPin); // Arrête le son du buzzer au démarrage
  attachInterrupt(digitalPinToInterrupt(buttonPin), handleSwitch, CHANGE);
  ledcSetup(0, 1000, 8); // Configure le canal 0 avec une fréquence de 1000 Hz et une résolution de 8 bits marche sans mais doit le faire sinon erreur dans java
  ledcAttachPin(buzzerPin, 0); // Attache le buzzer à ce canal
  Serial.println("Arduino prêt");
}

void loop() {
  while (!Serial.available()) {}
  if (Serial.available() > 0) {
    char test = Serial.read();

    if (test == '1') {
      experienc1();
    } else if (test == '2') {
      experienc2();
    }
  }
}

void startChronometer() {
  chronometerRunning = true;
  startTime = millis();
}

void stopChronometer() {
  chronometerRunning = false;
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - startTime;
  Serial.println(elapsedTime);
}

void experienc1() {
  int switchState = digitalRead(buttonPin);
  unsigned long randomDelay = random(2000, 5000); 
  delay(randomDelay);
  randomLedPin = random(3);

  if (randomLedPin == 0) {
    digitalWrite(yellowPin, HIGH);
  } else if (randomLedPin == 1) {
    digitalWrite(greenLedPin, HIGH);
  } else {
    digitalWrite(redLedPin, HIGH);
  }

  startChronometer();

  while (chronometerRunning) {
    if (digitalRead(buttonPin) == HIGH) {
      digitalWrite(yellowPin, LOW);
      digitalWrite(greenLedPin, LOW);
      digitalWrite(redLedPin, LOW);
      stopChronometer();
    }
  }
}

void experienc2() {
  int switchState = digitalRead(buttonPin);
  unsigned long randomDelay = random(2000, 5000); 
  delay(randomDelay);

  tone(buzzerPin, 1000);

  startChronometer();

  while (chronometerRunning) {
    if (digitalRead(buttonPin) == HIGH) {
      noTone(buzzerPin);
      stopChronometer();
    }
  }
}

void ICACHE_RAM_ATTR handleSwitch() {
  if (digitalRead(buttonPin) == HIGH && chronometerRunning == true) {
    digitalWrite(yellowPin, LOW);
    digitalWrite(greenLedPin, LOW);
    digitalWrite(redLedPin, LOW);
    noTone(buzzerPin);
    stopChronometer();
  }
}
