import jssc.SerialPort;
import jssc.SerialPortException;


import java.sql.SQLOutput;
import java.util.Scanner;

public class ArduinoConfig {
    private SerialPort serialPort;

    public ArduinoConfig() {
        this.serialPort = new SerialPort("/dev/ttyACM0");
    }

    public void init(){
        try {
            serialPort.openPort();
            serialPort.setParams(SerialPort.BAUDRATE_115200,
                    SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1,
                    SerialPort.PARITY_NONE);

        } catch (SerialPortException ex) {
            System.out.println("Error opening the serial port: " + ex);
        }
    }

    public SerialPort getSerialPort() {
        return serialPort;
    }

    public void setSerialPort(SerialPort serialPort) {
        this.serialPort = serialPort;
    }
}



