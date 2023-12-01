import jssc.SerialPortException;
import org.bson.types.ObjectId;

import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class ThreadServer extends Thread {

	BufferedReader br;
	PrintStream ps;
	Socket sock;
	DataExchanger exchanger;
	ArduinoConfig arduinoConfig;
	int idThread;
	User currentUser;
	int lastExpNumero;

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
		boolean stop = false;
		String req = "";
		String[] reqParts;
		int idExp = -1;

		// Used to know the number of experience currently created in the database
		lastExpNumero = exchanger.getMongoDriver().getLastExperience();

		try {
			while(!stop) {
				System.out.println("Création de l'utilisateur");
				req = br.readLine();
				if(req == null || req.isEmpty()) {
					ps.println("ERR no arguments received from client");
					break;
				}
				reqParts = req.split(" ");
				stop = requestAddUser(reqParts);
			}

			String response = exchanger.getHttpDriver().addResults("2", 12, 15, 10, currentUser);
//			while(true) {
//				System.out.println(lastExpNumero);
//				req = br.readLine();
//				if ((req == null) || (req.isEmpty())) {
//					break;
//				}
//
//				try{
//					idExp = Integer.parseInt(req);
//				} catch (NumberFormatException e){
//					ps.print("ERR experience numero is not an int");
//					break;
//				}
//
//				if(idExp < 0 || idExp > lastExpNumero){
//					ps.println("ERR experience numero doesn't exist");
//					break;
//				}
//
//				launchExperience(req);
//			}
			System.out.println("end of request loop");
		}
		catch(IOException e) {
			System.out.println("problem with receiving request: "+e.getMessage());
		}
	}

	public void launchExperience(String idExp){
		String react = "", exec = "", errors = "";
		try {
			this.arduinoConfig.getSerialPort().writeString(idExp);

			while (true) {
				if (this.arduinoConfig.getSerialPort().getInputBufferBytesCount() > 0) {
					react = this.arduinoConfig.getSerialPort().readString();
					System.out.println("Exp n°" + idExp + ", Temps de réaction (ms) : " + react);
					exec = this.arduinoConfig.getSerialPort().readString();
					System.out.println("Exp n°" + idExp + ", Temps d'exécution (ms) : " + exec);
					errors = this.arduinoConfig.getSerialPort().readString();
					System.out.println("Exp n°" + idExp + ", Nombre d'erreurs : " + errors);
					break;
				}
			}
		} catch (SerialPortException e) {
			System.out.println("Error writing to the serial port");
		}
		float[] res = checkValuesAddResults(react, exec, errors);
		if(res[0] == 1){
			ps.println("ERR invalid parameters");
			return;
		}
		String response = exchanger.getHttpDriver().addResults(idExp, res[1], res[2], (int) res[3], currentUser);
//		String response = exchanger.getMongoDriver().addResults(idExp, res[1], res[2], (int) res[3], currentUser);
	}

	public boolean requestAddUser(String[] params) throws IOException{
		if (params.length != 8) {
			ps.println("ERR invalid number of parameters");
			return false;
		}

		String[] resCheck = checkValuesAddUser(params[5], params[6], params[7]);
		if(resCheck[0].startsWith("ERR")){
			System.out.println("Error checkValuesAddUser: "+ resCheck[0]);
			ps.println(resCheck[0]);
			return false;
		}

		User user = new User(params[1], params[2], params[3], params[4], resCheck[1], resCheck[2], resCheck[3]);
//		String response = exchanger.getMongoDriver().addUser(user);
		String response = exchanger.getHttpDriver().addUser(user);
		System.out.println(response);
		String[] res = response.split(" ");
		if (response.startsWith("ERR")) {
			System.out.println("error with request create user: "+response);
			ps.println(response);
			return false;
		}

		ObjectId _id = new ObjectId(res[2]);
		user.setId(_id);
		this.currentUser = user;
		ps.println(res[0] + " " + res[1] + " " + lastExpNumero);
		return true;
	}

	public float[] checkValuesAddResults(String react, String exec, String errors){
		float[] res = new float[4];
		// 0 = success
		res[0] = 0;
		try{
			res[1] = Float.parseFloat(react);
			res[2] = Float.parseFloat(exec);
			res[3] = Integer.parseInt(errors);
		} catch (NumberFormatException e){
			// 1 = error
			res[0] = 1;
			return res;
		}
		if(res[3] < 0 || res[3] > 5)
			res[0] = 1;
		return res;
	}

	public String[] checkValuesAddUser(String age, String gender, String typeUser){
		String[] returnTab = new String[4];
		returnTab[0] = "OK";

		String response = isValueCorrect(age, Arrays.asList("Enfant", "Adolescent", "Adulte", "Personne Agée"), "ERR invalid age");
		if(response.startsWith("ERR")){
			returnTab[0] = response;
			return returnTab;
		}
		else {
			returnTab[1] = response;
		}

		response = isValueCorrect(gender, Arrays.asList("Masculin", "Féminin"), "ERR gender doesn't exist");
		if(response.startsWith("ERR")){
			returnTab[0] = response;
			return returnTab;
		}
		else {
			returnTab[2] = response;
		}

		response = isValueCorrect(typeUser, Arrays.asList("admin", "cobaye"), "ERR typeUser doesn't exist");
		if(response.startsWith("ERR")){
			returnTab[0] = response;
			return returnTab;
		}
		else {
			returnTab[3] = response;
		}

		return returnTab;
	}

	public String isValueCorrect(String value, List<String> choices, String error){
		int valueInt = -1;
		try{
			valueInt = Integer.parseInt(value);
		} catch (NumberFormatException e){
			return "ERR" + e.toString();
		}

		if(valueInt > 0 && valueInt < choices.size()+1){
			return choices.get(valueInt-1);
		}
		return error;
	}
}