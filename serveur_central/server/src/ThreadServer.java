import jssc.SerialPortException;
import org.bson.types.ObjectId;

import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.List;

class ThreadServer extends Thread {

	BufferedReader br;
	PrintStream ps;
	Socket sock;
	DataExchanger exchanger;
	ArduinoConfig arduinoConfig;
	int idThread;

	public ThreadServer(int idThread, Socket sock, DataExchanger data) {
		this.sock = sock;
		this.idThread = idThread;
		this.exchanger = data;
		this.arduinoConfig = new ArduinoConfig();
	}

	public void run() {
		arduinoConfig.init();
		try {
			br = new BufferedReader(new InputStreamReader(sock.getInputStream()));
			ps = new PrintStream(sock.getOutputStream());
		}
		catch(IOException e) {
			System.err.println("Thread "+ idThread +": cannot create streams. Aborting.");
			return;
		}
		requestLoop();
		System.out.println("end of thread "+ idThread);
	}

	public void requestLoop() {
		String req = "";
		String[] reqParts;

		try {
			System.out.println("Création de l'utilisateur");
			req = br.readLine();
			reqParts = req.split(" ");
			requestAddUser(reqParts);

			while(true) {
				System.out.print("Saisir un numéro d'expérience : ");
				req = br.readLine();
				if ((req == null) || (req.isEmpty())) {
					break;
				}

				reqParts = req.split(" ");

				launchExperience(reqParts[0]);
			}
			System.out.println("end of request loop");
		}
		catch(IOException e) {
			System.out.println("problem with receiving request: "+e.getMessage());
		}
	}

	public void launchExperience(String idExp){
		try {
			this.arduinoConfig.getSerialPort().writeString(idExp);

			while (true) {
				if (this.arduinoConfig.getSerialPort().getInputBufferBytesCount() > 0) {
					String data = this.arduinoConfig.getSerialPort().readString();
					//System.out.println("Data received from Arduino: " + data);
					// You can now process the data based on the chosen experience

					System.out.println("Exp n°" + idExp + ", Temps de réaction (ms) : " + data);
					//String response = exchanger.getHttpDriver().addResults(idExp, idUser, data);
					//String response = exchanger.getMongoDriver().addResults(idExp, idUser, data);
					break;
				}
			}
		} catch (SerialPortException e) {
			System.out.println("Error writing to the serial port");
		}
	}

	public boolean requestAddUser(String[] params) throws IOException{
		System.out.println("processing request ADD USER");

		if (params.length != 7) {
			ps.println("ERR invalid number of parameters");
			return false;
		}

		int age = -1;
		try{
			age = Integer.parseInt(params[4]);
		} catch (NumberFormatException e){
			System.out.println(e);
			return false;
		}

		//String response = exchanger.getMongoDriver().addUser(params[0], params[1], params[2], params[3], age, params[5], params[6]);
		String response = exchanger.getHttpDriver().addUser(params[0], params[1], params[2], params[3], age, params[5], params[6]);

		System.out.println(response);
		ps.println(response);
		return true;
	}

	protected void requestStoreMeasure(String[] params) throws IOException {
		System.out.println("processing request STORE MEASURE");

		if (params.length != 5) {
			ps.println("ERR invalid number of parameters");
			return;
		}
		// (un)comment to choose direct mongo access or through the node API
		//String answer = exchanger.getMongoDriver().saveMeasure(params[1], params[2], params[3], params[4]);
		String answer = exchanger.getHttpDriver().saveMeasure(params[1], params[2], params[3], params[4]);
		System.out.println(answer);
		ps.println(answer);
	}
}

		
