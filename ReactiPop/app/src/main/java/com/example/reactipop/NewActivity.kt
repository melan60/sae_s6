package com.android.example.cameraxapp

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.reactipop.R
import java.io.IOException
import java.io.PrintStream
import java.net.Socket

class NewActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_new)

        val imageUri = intent.getStringExtra("image_uri")
        val imageView = findViewById<ImageView>(R.id.imageView)
        imageView.setImageURI(Uri.parse(imageUri))

        // Bouton pour enregistrer la photo
        val saveButton = findViewById<Button>(R.id.save_button)
        saveButton.setOnClickListener {
            sendToServer()
            Toast.makeText(this, "Photo enregistrée et envoyée au serveur", Toast.LENGTH_SHORT)
                .show()
            finish()
        }

        // Bouton pour ne pas enregistrer la photo
        val dontSaveButton = findViewById<Button>(R.id.dont_save_button)
        dontSaveButton.setOnClickListener {
            contentResolver.delete(Uri.parse(imageUri), null, null)
            Toast.makeText(this, "Photo non enregistrée", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun sendToServer() {
        // TODO valeur
        val serverName = "192.168.227.99"
        val serverPort = 8000

        Thread {
            try {
                val socket = Socket(serverName, serverPort)
                val printStream = PrintStream(socket.getOutputStream())
                printStream.println("Coucou c'est le téléphone")
            } catch (e: IOException) {
                Log.e("ERR sendToConnect", e.message.toString())
            }
        }.start()
    }
}
