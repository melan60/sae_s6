#include "pitches.h"
#include "TM1637.h"

const int buzzerPin = 13;  // Broche du buzzer

const int defaultBtnPin = 21;  // Broche du bouton associé à la led jaune
const int greenLedPin = 23;    // Broche de la LED jaune

const int redBtnPin = 22;
const int redLedPin = 18;

const int yellowBtnPin = 19;  // Broche du bouton
const int yellowLedPin = 5;   // Broche de la LED jaune

const int CLK = 33;  // Broche de données
const int DIO = 32;  // Broche d'horloge

unsigned long startTime = 0;         // Variable pour stocker le temps de démarrage du chronomètre
boolean chronometerRunning = false;  // Indique si le chronomètre est en cours d'exécution

TM1637 tm1637(CLK, DIO);

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

  tm1637.init();
  tm1637.set(BRIGHT_TYPICAL);

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
    } else if (test == '4') {
      experience4();
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
  int randomNumber = random(1, 4);

  if (randomNumber == 1) {
    digitalWrite(greenLedPin, HIGH);
  } else if (randomNumber == 2) {
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

void experience2() {
  unsigned long randomDelay = random(2000, 5000);
  delay(randomDelay);
  int randomNumber = random(1, 4);

  tone(buzzerPin, 1000);

  if (randomNumber == 1) {
    digitalWrite(greenLedPin, HIGH);
  } else if (randomNumber == 2) {
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

bool btnIsHigh(int btn) {
  return digitalRead(btn) == HIGH;
}

void experience3() {
  int number = random(1, 4);

  tm1637.clearDisplay();
  tm1637.display(0, number);
  startChronometer();

  while (chronometerRunning) {
    if (aBtnIsHigh()) {
      if (btnIsHigh(defaultBtnPin) && number == 1 || btnIsHigh(redBtnPin) && number == 2 || btnIsHigh(yellowBtnPin) && number == 3) {
        Serial.println("Réussite");
      } else {
        Serial.println("Échec");
      }
      stopChronometer();
    }
  }
}


// =================================================== experience n°4 // peut pas faire d'erreur

void experience4() {
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
