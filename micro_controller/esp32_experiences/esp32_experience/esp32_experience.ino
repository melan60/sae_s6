#include "TM1637.h"

// temps de réaction : temps entre le moment ou la lampe s'est allumée et le moment ou on a laché le capteur
// temps d'exécution : temps entre le moment ou on lache le capteur et le moment ou on appuie sur le bouton

const int buzzerPin = 13;  // Broche du buzzer

const int defaultBtnPin = 21;  // Broche du bouton associé à la led jaune
const int greenLedPin = 23;    // Broche de la LED jaune

const int redBtnPin = 22;
const int redLedPin = 18;

const int yellowBtnPin = 19;  // Broche du bouton
const int yellowLedPin = 5;   // Broche de la LED jaune

const int CLK = 33;  // Broche de données
const int DIO = 32;  // Broche d'horloge

const int nb_repetitions = 2;

unsigned long startTime = 0;           // Variable pour stocker le temps de démarrage du chronomètre
double reactTime = 0;                  // Variable pour stocker le temps de de réaction de l'utilisateur
unsigned long reactTimeIteration = 0;  // Variable pour stocker le temps de de réaction de l'utilisateur pour une itération
double execTime = 0;                   // Variable pour stocker le temps d'exécution de l'utilisateur
unsigned long errors = 0;              // Variable pour stocker le nombre d'erreurs réalisées

bool chronometerRunning = false;  // Indique si le chronomètre est en cours d'exécution
bool reactMovement;

const int pinCapteurVibration = 25;  // Broche du capteur de vibration

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

  pinMode(pinCapteurVibration, INPUT);

  tm1637.init();
  tm1637.set(BRIGHT_TYPICAL);

  // Serial.println("Arduino prêt");
}

void loop() {
  while (!Serial.available()) {}

  if (Serial.available() > 0) {
    char test = Serial.read();

    errors = 0;
    reactTime = 0;
    execTime = 0;

    if (test == '1') {
      for (int i = 0; i < nb_repetitions; i += 1) {
        reactMovement = 0;
        experience1();
        // delay(5000);
      }
    } else if (test == '2') {
      for (int i = 0; i < nb_repetitions; i += 1) {
        reactMovement = 0;
        experience2();
      }
    } else if (test == '3') {
      for (int i = 0; i < nb_repetitions; i += 1) {
        reactMovement = 0;
        experience3();
      }
    } else if (test == '4') {
      for (int i = 0; i < nb_repetitions; i += 1) {
        reactMovement = 0;
        experience4();
      }
    }
    // else {
    //   Serial.println("Err : expérience non implémentée");  // Exit(1)
    // }

    reactTime = reactTime / nb_repetitions / 1000;  // convertion en secondes
    execTime = execTime / nb_repetitions / 1000;    // convertion en secondes

    Serial.println(reactTime);
    Serial.println(execTime);
    Serial.println(errors);
  }
}


// =================================================== commun aux experiences

void startChronometer() {
  chronometerRunning = true;
  startTime = millis();
}

unsigned long stopChronometer() {
  chronometerRunning = false;
  unsigned long currentTime = millis();
  return currentTime - startTime;
}

void goodBtnIsHigh(int btn, int led) {
  if (digitalRead(led) == HIGH && aBtnIsHigh()) {
    if (digitalRead(btn) != HIGH) {
      errors += 1;
    }
    digitalWrite(led, LOW);
    noTone(buzzerPin);
    const long time = stopChronometer();
    execTime += time - reactTimeIteration;
  }
}

bool aBtnIsHigh() {
  return (digitalRead(defaultBtnPin) == HIGH || digitalRead(redBtnPin) == HIGH || digitalRead(yellowBtnPin) == HIGH);
}

void detectMovement() {
  if (digitalRead(pinCapteurVibration) == HIGH && reactMovement == 0) {  //TODO
    reactTimeIteration = millis() - startTime;
    reactTime += reactTimeIteration;
    reactMovement = 1;
  }
}

void wait() {
  unsigned long randomDelay = random(2000, 5000);
  delay(randomDelay);
}

void allumerLed() {
  int randomNumber = random(1, 4);

  if (randomNumber == 1) {
    digitalWrite(greenLedPin, HIGH);
  } else if (randomNumber == 2) {
    digitalWrite(redLedPin, HIGH);
  } else {
    digitalWrite(yellowLedPin, HIGH);
  }
}

void verifierLebtnClique() {
  while (chronometerRunning) {
    detectMovement();

    goodBtnIsHigh(defaultBtnPin, greenLedPin);
    goodBtnIsHigh(redBtnPin, redLedPin);
    goodBtnIsHigh(yellowBtnPin, yellowLedPin);
  }
}


// =================================================== experience n°1
void experience1() {
  wait();
  allumerLed();
  startChronometer();
  verifierLebtnClique();
}


// =================================================== experience n°2
void experience2() {  // TODO buzzer sonne tout le temps !
  tone(buzzerPin, 1000);
  wait();
  allumerLed();
  startChronometer();
  verifierLebtnClique();
}


// =================================================== experience n°3
bool btnIsHigh(int btn) {
  return digitalRead(btn) == HIGH;
}

void verifieLeBtnClique2(int number, int nb1, int nb2, int nb3) {
  while (chronometerRunning) {
    detectMovement();

    if (aBtnIsHigh()) {
      if (btnIsHigh(defaultBtnPin) && number == nb1 || btnIsHigh(redBtnPin) && number == nb2 || btnIsHigh(yellowBtnPin) && number == nb3) {  // TODO
      } else {
        errors += 1;
      }
      execTime += stopChronometer() - reactTimeIteration;
    }
  }
}

void experience3() {
  tm1637.clearDisplay();
  wait();
  int number = random(1, 4);  // TODO
  tm1637.display(0, number);
  startChronometer();
  verifieLeBtnClique2(number, 1, 1 + 1, 1 + 2);
}


// =================================================== experience n°4 // peut pas faire d'erreur

void verifieCobayeCliqueBtnDefaut() {
  while (chronometerRunning) {
    detectMovement();

    if (digitalRead(defaultBtnPin) == HIGH) {
      noTone(buzzerPin);
      execTime += stopChronometer() - reactTimeIteration;
    }
  }
}

void experience4() {
  wait();
  tone(buzzerPin, 1000);
  startChronometer();
  verifieCobayeCliqueBtnDefaut();
}
