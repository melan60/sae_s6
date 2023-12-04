import java.io.*;
import java.net.*;

class MainClient  {

	BufferedReader br;
	PrintStream ps;
	Socket sock;
	BufferedReader consoleIn; // to read from keyboard

	String nameUser;
	int lastNumeroExperience;

	public MainClient(String serverAddr, int port) throws IOException {
		consoleIn = new BufferedReader(new InputStreamReader(System.in));
		sock = new Socket(serverAddr,port);
		br = new BufferedReader(new InputStreamReader(sock.getInputStream()));
		ps = new PrintStream(sock.getOutputStream());
	}

	public void mainLoop() {
		String req = "";
		boolean stop = false;

		try {
			while(!stop) {
				stop = createUser();
			}
			stop = false;
			// reading requests from keyboard
			while (!stop) {
				System.out.print(nameUser + " [Saisie du numéro de l'expérience (de 1 à " + lastNumeroExperience + ")]> ");
				req = consoleIn.readLine();
				if (req == null || req.equals("quit")) {
					stop = true;
				}
				else {
					ps.println(req);
					String response = br.readLine();
					System.out.println(response);
				}
			}
		}
		catch(IOException e) {
			System.out.println("cannot communicated with server. Aborting");
		}
	}

	/**
	 * Create a user
	 * @return true if the user is created, false otherwise
	 * @throws IOException if an error occurs while reading the keyboard
	 */
	protected boolean createUser() throws IOException{
		String req = "";
		String response = "";
		System.out.println("Saisir les informations de l'utilisateur :");
		String[] list = {"Nom de famille", "Prénom", "Mot de passe", "Email", "Age \n\t\t- Enfant = 1, \n\t\t- Adolescent = 2, \n\t\t- Adulte = 3, \n\t\t- Personne Agée = 4 \n\t\t", "Sexe \n\t\t- Masculin = 1, \n\t\t- Féminin = 2 \n\t\t", "Type \n\t\t- admin = 1, \n\t\t- cobaye = 2 \n\t\t"};

		for (String var : list){
			System.out.print("\t * " + var + ": ");
			req = req + " " + consoleIn.readLine();
		}
		ps.println(req);

		response = br.readLine();
		if (response.startsWith("ERR")) {
			System.out.println("error with request create user:" + response);
			return false;
		}
		String[] res = response.split(" ");
		System.out.println(res[0]);
		nameUser = res[1];
		lastNumeroExperience = Integer.parseInt(res[2]);
		return true;
	}
}
		
