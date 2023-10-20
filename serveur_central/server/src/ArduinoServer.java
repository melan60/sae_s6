import jssc.SerialPort;
import jssc.SerialPortException;
import jssc.SerialPortEventListener;
import jssc.SerialPortEvent;

public class ArduinoServer {

    public static void main(String[] args) {
        SerialPort serialPort = new SerialPort("/dev/ttyACM0");

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
                    if (event.isRXCHAR() && event.getEventValue() > 0) {
                        try {
                            // Lire les données reçues depuis l'Arduino
                            String data = serialPort.readString(event.getEventValue());
                            System.out.println("Données reçues de l'Arduino : " + data);
                            System.out.println(data.length());
                            // Vous pouvez maintenant traiter les données, par exemple :
                            if (data.equals("ON")) {
                                System.out.println("Le switch est activé (ON)");
                            } else if (data.equals("OFF")) {
                                System.out.println("Le switch est désactivé (OFF)");
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