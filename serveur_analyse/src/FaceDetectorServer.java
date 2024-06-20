import java.io.*;
import java.net.*;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.time.Duration;
import java.time.LocalTime;

import javax.imageio.ImageIO;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.opencv.objdetect.Objdetect;

public class FaceDetectorServer {

    public static void main(String[] args) {
        InputStream inputStream;

        ServerSocket socketServer = null;
        Socket socketClient;

        if (args.length != 3) {
            System.err.println("ERR usage : portMobile (8000) localhost portServerCentral");
            System.exit(1);
        }

        try {
            int port = Integer.parseInt(args[0]);
            socketServer = new ServerSocket(port);
        } catch (IOException e) {
            System.err.println("ERR problème création socket serveur : " + e.getMessage());
            System.exit(1);
        }

        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

        String addrMainServer = args[1];
        int portMainServer = Integer.parseInt(args[2]);
        PrintStream psMainServer = connectToMainServer(addrMainServer, portMainServer);

        try {
            while (true) {
                socketClient = socketServer.accept();

                inputStream = socketClient.getInputStream();

                String start_time = getTime(inputStream);
                String stop_time = getTime(inputStream);
                long execTime = calculateExecTime(start_time, stop_time);

                Mat image = getImageFromMobile(inputStream);
                Imgcodecs.imwrite("Images/output.jpg", image);
                int direction = imageAnalyse(image);

                inputStream.close();
                socketClient.close();

                sendToMainServer(psMainServer, "analyse");
                sendToMainServer(psMainServer, String.valueOf(execTime) + " " + String.valueOf(direction));
            }
        } catch (IOException | NullPointerException e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }

    private static String getTime(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int size = inputStream.read();
        byte[] tabTime = new byte[size + 1];
        int nRead;

        if ((nRead = inputStream.read(tabTime, 0, size + 1)) != -1) {
            buffer.write(tabTime, 0, nRead);
        }

        String time = "";
        for (int i = 0; i < size; i++) {
            time += Character.toString(tabTime[i]);
        }

        buffer.close();
        return time;
    }

    private static long calculateExecTime(String start_time, String stop_time) {
        LocalTime startTime = LocalTime.parse(start_time);
        LocalTime endTime = LocalTime.parse(stop_time);

        Duration duration = Duration.between(startTime, endTime);

        long execTime = duration.getSeconds();

        System.out.println("Temps d'exécution : " + execTime);

        return execTime;
    }

    private static Mat getImageFromMobile(InputStream inputStream) throws IOException, NullPointerException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[16384];
        int nRead;

        while ((nRead = inputStream.read(data, 0, 1024)) != -1) {
            buffer.write(data, 0, nRead);
        }

        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(buffer.toByteArray()));
        Mat image = new Mat(bufferedImage.getHeight(), bufferedImage.getWidth(), CvType.CV_8UC3);
        image.put(0, 0, ((DataBufferByte) bufferedImage.getRaster().getDataBuffer()).getData());

        buffer.close();
        return image;
    }

    private static int imageAnalyse(Mat image) {
        Mat grayFrame = new Mat();
        Imgproc.cvtColor(image, grayFrame, Imgproc.COLOR_BGR2GRAY); //convert to gray scale
        Imgproc.equalizeHist(grayFrame, grayFrame); //improve contrast for better result

        int height = grayFrame.height();
        int absoluteFaceSize = 0;
        if (Math.round(height * 0.2f) > 0) {
            absoluteFaceSize = Math.round(height * 0.2f);
        }

        CascadeClassifier faceCascade = new CascadeClassifier();
        MatOfRect faces = new MatOfRect();

        //lode trained data file
        faceCascade.load("Data/haarcascade_frontalface_default.xml");
        faceCascade.detectMultiScale(grayFrame, faces, 1.1, 2, 0 | Objdetect.CASCADE_SCALE_IMAGE,
                new Size(absoluteFaceSize, absoluteFaceSize), new Size());

        //Detect faces
        Rect[] faceArray = faces.toArray();
        if (faceArray.length == 1) {
            System.out.println("Les participants ne regardent pas dans la même direction.");
            return 1;
        }

        System.out.println("Les participants regardent dans la même direction.");
        return 0;
    }

    private static PrintStream connectToMainServer(String addrMainServer, int portMainServer) {
        Socket socketMainServer;
        PrintStream psMainServer = null;
        try {
            socketMainServer = new Socket(addrMainServer, portMainServer);
            psMainServer = new PrintStream(socketMainServer.getOutputStream()); // création flux écriture lignes de texte
        } catch (Exception e) {
            System.err.println("ERR connection with main server : " + e.getMessage());
            System.exit(1);
        }
        return psMainServer;
    }

    private static void sendToMainServer(PrintStream ps, String message) {
        ps.println(message);
    }
}
