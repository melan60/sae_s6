import java.io.*;
import java.net.*;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

import javax.imageio.ImageIO;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.opencv.objdetect.Objdetect;

public class FaceDetectorServer {

    public static void main(String[] args) {
        BufferedImage bufferedImage;
        ByteArrayOutputStream buffer;
        InputStream in;
        ServerSocket socketServer = null;
        Socket socketClient;

        int nRead;

        if (args.length != 3) {
            System.err.println("ERR usage");
            System.exit(1);
        }

        try {
            int port = Integer.parseInt(args[0]); // récupération du port sous forme int
            socketServer = new ServerSocket(port); // création socket serveur
        } catch (IOException e) {
            System.err.println("ERR problème création socket serveur : " + e.getMessage());
            System.exit(1);
        }

        // Connection to the main server
//        String addrMainServer = args[1];
//        int portMainServer = Integer.parseInt(args[2]);
//        PrintStream psMainServer = connectToMainServer(addrMainServer, portMainServer);

        try {
            while (true) {
                socketClient = socketServer.accept(); // attente connexion client
                System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

                buffer = new ByteArrayOutputStream();
                in = socketClient.getInputStream();
                byte[] data = new byte[16384];
                while ((nRead = in.read(data, 0, data.length)) != -1) {
                    buffer.write(data, 0, nRead);
                }

                bufferedImage = ImageIO.read(new ByteArrayInputStream(buffer.toByteArray()));
                Mat image = new Mat(bufferedImage.getHeight(), bufferedImage.getWidth(), CvType.CV_8UC3);
                image.put(0, 0, ((DataBufferByte) bufferedImage.getRaster().getDataBuffer()).getData());

                Imgcodecs.imwrite("Images/output.jpg", image);

                buffer.close();
                in.close();
                socketClient.close();

                // create method for detect
                imageAnalyse(image);
//                sendToMainServer(psMainServer, "TODO");
            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }

    private static PrintStream connectToMainServer(String addrMainServer, int portMainServer) {
        Socket socketMainServer;
        PrintStream psMainServer = null;
        try {
            System.out.println(addrMainServer + "  " + portMainServer);
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

    private static void imageAnalyse(Mat image) {
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
        } else {
            System.out.println("Les participants regardent dans la même direction.");
        }
    }
}
