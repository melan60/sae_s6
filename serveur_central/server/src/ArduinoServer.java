import jssc.SerialPort;
import jssc.SerialPortException;
import jssc.SerialPortEventListener;
import jssc.SerialPortEvent;
import java.util.Scanner;

public class ArduinoServer {

    public static void main(String[] args) {
        SerialPort serialPort = new SerialPort("/dev/ttyACM0");
        Scanner scanner = new Scanner(System.in);

        try {
            serialPort.openPort();
            serialPort.setParams(SerialPort.BAUDRATE_115200,
                    SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1,
                    SerialPort.PARITY_NONE);

            while (true) {
                System.out.print("Enter experience (1 or 2): ");
                String experience = scanner.nextLine();

                try {
                    serialPort.writeString(experience);
                } catch (SerialPortException e) {
                    System.out.println("Error writing to the serial port");
                }

                while (true) {
                    if (serialPort.getInputBufferBytesCount() > 0) {
                        String data = serialPort.readString();
                        //System.out.println("Data received from Arduino: " + data);
                        // You can now process the data based on the chosen experience
                        if (experience.equals("1")) {
                            System.out.println("Temps de réaction (ms) : " + data);
                        } else if (experience.equals("2")) {
                            System.out.println("Temps de réaction (ms) : " + data);
                        }
                        break;
                    }
                }
            }
        } catch (SerialPortException ex) {
            System.out.println("Error opening the serial port: " + ex);
        }
    }
}
