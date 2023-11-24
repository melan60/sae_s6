import jssc.SerialPort;
import jssc.SerialPortException;
import jssc.SerialPortEventListener;
import jssc.SerialPortEvent;

import java.util.Scanner;


public class ArduinoServer {

    public static void main(String[] args) {
        SerialPort serialPort = new SerialPort("/dev/ttyACM0");
        Scanner scan =new Scanner(System.in);

        try {
            serialPort.openPort();
            serialPort.setParams(SerialPort.BAUDRATE_115200,
                    SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1,
                    SerialPort.PARITY_NONE);

            // Ajoute un écouteur d'événements pour la communication série
            serialPort.addEventListener(new SerialPortEventListener() {
                @Override
                public void serialEvent(SerialPortEvent event) {
                    String experience = scan.nextLine();
                    try{
                        serialPort.writeString(experience);
                    }catch (SerialPortException e){
                        System.out.println("err");
                    }


                    if (event.isRXCHAR() && event.getEventValue() > 0) {
                        try {
                            // Lire les données reçues depuis l'Arduino
                            String data = serialPort.readString(event.getEventValue());
                            //System.out.println("Données reçues de l'Arduino : " + data);
                            //System.out.println(data.length());
                            // Vous pouvez maintenant traiter les données, par exemple :
                            if (experience.equals("1")) {
                                System.out.println("Le switch est en état: "+data);
                            } else if (experience.equals("2")) {
                                System.out.println("Le switch est en état: "+data);
                            }
                        } catch (SerialPortException ex) {
                            System.out.println("Erreur lors de la lecture des données de l'Arduino : " + ex);
                        }

                    }
                }
            });
        } catch (SerialPortException ex) {
            System.out.println("Erreur lors de l'ouverture du port série : " + ex);
        }


    }
}