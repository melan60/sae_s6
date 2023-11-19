import java.io.*;
import java.net.*;

class MainServer  {

    ServerSocket conn;
    Socket sock;
    int port;
    DataExchanger exchanger;
    int idThread;

    public MainServer(int port) throws IOException {
        this.port = port;
        conn = new ServerSocket(port,1);
        idThread = 1;
        String portApi = System.getenv("PORT_API");
        String name_db = System.getenv("DATABASE_NAME");
        exchanger = new DataExchanger("http://localhost:"+portApi+"/"+name_db, "mongodb://localhost:27017");
        // need to initializae mongo driver
        if (!exchanger.getMongoDriver().init()) {
            throw new IOException("cannot reach mongodb server and/or api database");
        }
    }

    public void mainLoop() throws IOException {
        while(true) {
            sock = conn.accept();
            System.out.println("new client connected, thread id = "+ idThread);
            ThreadServer t = new ThreadServer(idThread++, sock, exchanger);
            t.start();
        }
    }
}

		
