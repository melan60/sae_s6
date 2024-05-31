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

	// TODO supprimer cette méthode
	public void devLoop() {
		System.out.println("ENTERING DEV LOOP, TO DELETE LATER");
		String req = "";
		boolean stop = false;

		try {
			ps.println("client");
			nameUser = "Patel";
			lastNumeroExperience = 5;
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
	 * Méthode principale du client <br>
	 * - Lance la méthode de création du client <br>
	 * - Gère la boucle de saisie de requêtes du client
	 */
	public void mainLoop() {
		String req = "";
		boolean stop = false;

		try {
			ps.println("client");
			// Boucle de création du client
			while(!stop) {
				stop = createUser();
			}
			stop = false;
			// Boucle de saisie de requêtes
			while (!stop) {
				System.out.print(nameUser + " [Saisie du numéro de l'expérience (de 1 à " + lastNumeroExperience + ")]> ");
				// Lecture du numéro saisi
				req = consoleIn.readLine();
				// Termine la boucle en fonction de la valeur saisie
				if (req == null || req.equals("quit")) {
					stop = true;
				}
				else {
					// Envoi de la réponse du client au serveur
					ps.println(req);
					// Lecture de la réponse du serveur
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
	 * Créé un utilisateur <br>
	 * Communique avec {@link ThreadServer#requestAddUser(String [])}
	 * @return true si l'utilisateur est créé, false sinon
	 * @throws IOException si une erreur arrive pendant la lecture des saisies depuis le clavier
	 */
	protected boolean createUser() throws IOException{
		String req = "";
		String response = "";
		System.out.println("Saisir les informations de l'utilisateur :");
		// Liste des informations affichées sur le terminal pour pouvoir boucler au niveau de l'affichage en dessous
		String[] list = {"Nom de famille", "Prénom", "Mot de passe", "Email", "Age \n\t\t- Enfant = 1, \n\t\t- Adolescent = 2, \n\t\t- Adulte = 3, \n\t\t- Personne Agée = 4 \n\t\t", "Sexe \n\t\t- Masculin = 1, \n\t\t- Féminin = 2 \n\t\t", "Type \n\t\t- admin = 1, \n\t\t- cobaye = 2 \n\t\t"};

		// Boucle d'affichage
		for (String var : list){
			System.out.print("\t * " + var + ": ");
			// Pour chaque ligne, récupère l'information saisie par le client
			req = req + " " + consoleIn.readLine();
		}
		// Envoi des informations au serveur
		ps.println(req);

		// Récupération de la réponse du serveur
		response = br.readLine();
		if (response.startsWith("ERR")) {
			System.out.println("error with request create user:" + response);
			return false;
		}
		// Réponse sous la forme (OK nomFamille numExp)
		String[] res = response.split(" ");
		System.out.println(res[0]);
		nameUser = res[1];
		lastNumeroExperience = Integer.parseInt(res[2]);
		return true;
	}
}
		
