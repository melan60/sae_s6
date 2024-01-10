import java.io.*;

class CentralServer {

  public static void main(String []args) {

    MainServer server = null;

    if (args.length != 1) {
      System.out.println("usage: CentralServer port");
      System.exit(1);
    }

    try {
      int port = Integer.parseInt(args[0]);
      server = new MainServer(port);
      server.mainLoop();
    }
    catch(IOException e) {
      System.out.println("server down: "+e.getMessage());
      System.exit(1);
    }
  }
}
		
