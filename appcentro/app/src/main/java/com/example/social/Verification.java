package com.example.social;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class Verification extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verification);
        String text = getIntent().getStringExtra("text");
        String name = getIntent().getStringExtra("name");
        TextView status = findViewById(R.id.status);
        status.setText(name+"\n"+text);

        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        updateUI(currentUser);
    }


    private void updateUI(FirebaseUser user){
        if(user!=null){

        }else{
            Intent i = new Intent(Verification.this, MainActivity.class);
            startActivity(i);
        }

    }
}
