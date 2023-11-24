unsigned long startTime = 0; // Variable pour stocker le temps de démarrage du chronomètre
boolean chronometerRunning = false; // Indique si le chronomètre est en cours d'exécution

char test;

void setup() {
  Serial.begin(115200);
  pinMode(5, OUTPUT); // LED
  pinMode(27, INPUT); // Switch
  //digitalWrite(5, LOW);
  attachInterrupt(digitalPinToInterrupt(27),handleSwitch,CHANGE);
  Serial.println("Arduino prêt");
}

void loop() {
  while (!Serial.available()) {}
  if (Serial.available() > 0) {
    char test = Serial.read();

    if(test=='1'){
      experienc1();
    }else if(test=='2'){
      experienc2();
    }
  }
}

void experienc1(){
  //int switchState = digitalRead(27);
  delay(1000); //valeur à mettre aléatoirement
  digitalWrite(5, HIGH);
  startTime = millis();
  chronometerRunning = true;
  //Serial.print(switchState);
}

void experienc2(){
  int switchState = digitalRead(27);
  digitalWrite(5, LOW);
  Serial.print(switchState);
  delay(500);

}

void ICACHE_RAM_ATTR handleSwitch(){
  if(digitalRead(27) == HIGH && chronometerRunning == true){
    digitalWrite(5, LOW);
    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - startTime;
    chronometerRunning = false;
    Serial.print(elapsedTime);
  }
}