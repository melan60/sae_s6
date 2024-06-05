import org.junit.jupiter.api.Test;
import java.io.*;
import java.net.Socket;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MainClientUnitTest {

    @Test
    public void testCreateUserSuccess() throws IOException, InterruptedException {
        BufferedReader consoleInMock = mock(BufferedReader.class);
        PipedInputStream socketIn = new PipedInputStream();
        PipedOutputStream socketOut = new PipedOutputStream(socketIn);
        PrintStream socketOutMock = new PrintStream(socketOut);

        Socket socketMock = mock(Socket.class);
        when(socketMock.getInputStream()).thenReturn(socketIn);
        when(socketMock.getOutputStream()).thenReturn(socketOutMock);

        MainClient mainClient = new MainClient("127.0.0.1", 2000);
        mainClient.consoleIn = consoleInMock;
        mainClient.br = new BufferedReader(new InputStreamReader(socketIn));
        mainClient.ps = socketOutMock;

        when(consoleInMock.readLine())
                .thenReturn("Jhon")
                .thenReturn("Doe")
                .thenReturn("password")
                .thenReturn("john.doe@example.com")
                .thenReturn("2")
                .thenReturn("1")
                .thenReturn("2");

        new Thread(() -> {
            try {
                Thread.sleep(100);
                socketOut.write("OK Jhon 15\n".getBytes());
                socketOut.flush();
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        boolean result = mainClient.createUser();

        assertTrue(result, "La création de l'utilisateur a échoué.");
        assertEquals("Jhon", mainClient.nameUser, "Le nom de l'utilisateur n'est pas celui attendu.");
        verify(consoleInMock, times(7)).readLine();
    }

    @Test
    public void testCreateUserError() throws IOException, InterruptedException {
        BufferedReader consoleInMock = mock(BufferedReader.class);
        PipedInputStream socketIn = new PipedInputStream();
        PipedOutputStream socketOut = new PipedOutputStream(socketIn);
        PrintStream socketOutMock = new PrintStream(socketOut);

        Socket socketMock = mock(Socket.class);
        when(socketMock.getInputStream()).thenReturn(socketIn);
        when(socketMock.getOutputStream()).thenReturn(socketOutMock);

        MainClient mainClient = new MainClient("127.0.0.1", 2000);
        mainClient.consoleIn = consoleInMock;
        mainClient.br = new BufferedReader(new InputStreamReader(socketIn));
        mainClient.ps = socketOutMock;

        when(consoleInMock.readLine())
                .thenReturn("Doe")
                .thenReturn("Bob")
                .thenReturn("password")
                .thenReturn("john.doe@example.com")
                .thenReturn("1")
                .thenReturn("1")
                .thenReturn("2");

        new Thread(() -> {
            try {
                Thread.sleep(100);
                socketOut.write("ERR Some error message\n".getBytes());
                socketOut.flush();
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        boolean result = mainClient.createUser();

        assertTrue(result, "La création de l'utilisateur aurait dû échouer.");
    }
}
