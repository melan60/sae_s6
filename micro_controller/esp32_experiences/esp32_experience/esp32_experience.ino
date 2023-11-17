// #include "pitches.h"

// int melody[] = {
//   REST, NOTE_D4,
//   NOTE_G4, NOTE_AS4, NOTE_A4,
//   NOTE_G4, NOTE_D5,
//   NOTE_C5,
//   NOTE_A4,
//   NOTE_G4, NOTE_AS4, NOTE_A4,
//   NOTE_F4, NOTE_GS4,
//   NOTE_D4,
//   NOTE_D4,

//   NOTE_G4, NOTE_AS4, NOTE_A4,
//   NOTE_G4, NOTE_D5,
//   NOTE_F5, NOTE_E5,
//   NOTE_DS5, NOTE_B4,
//   NOTE_DS5, NOTE_D5, NOTE_CS5,
//   NOTE_CS4, NOTE_B4,
//   NOTE_G4,
//   NOTE_AS4
// };

// int durations[] = {
//   2, 4,
//   4, 8, 4,
//   2, 4,
//   2,
//   2,
//   4, 8, 4,
//   2, 4,
//   1,
//   4,

//   4, 8, 4,
//   2, 4,
//   2, 4,
//   2, 4,
//   4, 8, 4,
//   2, 4,
//   1,
//   4
// };

const int buzzerPin = 13;  // Broche du buzzer

const int defaultBtnPin = 21;  // Broche du bouton associé à la led jaune
const int greenLedPin = 23;    // Broche de la LED jaune

const int redBtnPin = 22;
const int redLedPin = 18;

const int yellowBtnPin = 19;  // Broche du bouton
const int yellowLedPin = 5;   // Broche de la LED jaune

unsigned long startTime = 0;         // Variable pour stocker le temps de démarrage du chronomètre
boolean chronometerRunning = false;  // Indique si le chronomètre est en cours d'exécution

void setup() {
  Serial.begin(115200);

  pinMode(defaultBtnPin, INPUT);
  pinMode(greenLedPin, OUTPUT);

  pinMode(redBtnPin, INPUT);
  pinMode(redLedPin, OUTPUT);

  pinMode(yellowBtnPin, INPUT);
  pinMode(yellowLedPin, OUTPUT);

  pinMode(buzzerPin, OUTPUT);
  noTone(buzzerPin);  // Arrête le son du buzzer au démarrage

  ledcSetup(0, 1000, 8);        // Configure le canal 0 avec une fréquence de 1000 Hz et une résolution de 8 bits marche sans mais doit le faire sinon erreur dans java
  ledcAttachPin(buzzerPin, 0);  // Attache le buzzer à ce canal
  Serial.println("Arduino prêt");
}

void loop() {
  while (!Serial.available()) {}
  if (Serial.available() > 0) {
    char test = Serial.read();

    if (test == '1') {
      experience1();
    } else if (test == '2') {
      experience2();
    } else if (test == '3') {
      experience3();
    }
  }
}

// =================================================== commun aux experiences

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

void goodBtnIsHigh(int btn, int led) {
  if (digitalRead(led) == HIGH && aBtnIsHigh()) {
    if (digitalRead(btn) == HIGH) {
      Serial.println("Reussite");
    } else {
      Serial.println("Échec");
    }
    digitalWrite(led, LOW);
    noTone(buzzerPin);
    stopChronometer();
  }
}

bool aBtnIsHigh() {
  return (digitalRead(defaultBtnPin) == HIGH || digitalRead(redBtnPin) == HIGH || digitalRead(yellowBtnPin) == HIGH);
}

// =================================================== experience n°1

void experience1() {
  unsigned long randomDelay = random(2000, 5000);
  delay(randomDelay);
  int randomLedPin = random(3);

  if (randomLedPin == 0) {
    digitalWrite(greenLedPin, HIGH);
  } else if (randomLedPin == 1) {
    digitalWrite(redLedPin, HIGH);
  } else {
    digitalWrite(yellowLedPin, HIGH);
  }

  startChronometer();

  while (chronometerRunning) {
    goodBtnIsHigh(defaultBtnPin, greenLedPin);
    goodBtnIsHigh(redBtnPin, redLedPin);
    goodBtnIsHigh(yellowBtnPin, yellowLedPin);
  }
}

// =================================================== experience n°2

// void experience2() {

//   int size = sizeof(durations) / sizeof(int);

//   for (int note = 0; note < size; note++) {
//     //to calculate the note duration, take one second divided by the note type.
//     //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
//     int duration = 1000 / durations[note];
//     tone(buzzerPin, melody[note], duration);

//     //to distinguish the notes, set a minimum time between them.
//     //the note's duration + 30% seems to work well:
//     int pauseBetweenNotes = duration * 1.30;
//     delay(pauseBetweenNotes);

//     //stop the tone playing:
//     noTone(buzzerPin);
//   }
// }

void experience2() {

  unsigned long randomDelay = random(2000, 5000);
  delay(randomDelay);
  int randomLedPin = random(3);
  tone(buzzerPin, 1000);

  if (randomLedPin == 0) {
    digitalWrite(greenLedPin, HIGH);
  } else if (randomLedPin == 1) {
    digitalWrite(redLedPin, HIGH);
  } else {
    digitalWrite(yellowLedPin, HIGH);
  }

  startChronometer();

  while (chronometerRunning) {
    goodBtnIsHigh(defaultBtnPin, greenLedPin);
    goodBtnIsHigh(redBtnPin, redLedPin);
    goodBtnIsHigh(yellowBtnPin, yellowLedPin);
  }
}

// =================================================== experience n°3

void experience3() {
  unsigned long randomDelay = random(2000, 5000);
  delay(randomDelay);

  tone(buzzerPin, 1000);

  startChronometer();

  while (chronometerRunning) {
    if (digitalRead(defaultBtnPin) == HIGH) {
      noTone(buzzerPin);
      stopChronometer();
    }
  }
}
