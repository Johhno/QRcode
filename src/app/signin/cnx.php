<?php
$nom 	= $_POST['nom'];
$prenom = $_POST['prenom'];

try
{
	$bdd = new PDO('mysql:host=localhost;dbname=test;charset=utf8', 'root', '');
}
catch(Exception $e)
{
        die('Erreur : '.$e->getMessage());
}

// On ajoute une entrée dans la table jeux_video
$req = $bdd->prepare('INSERT INTO personne(nom, prenom) VALUES(:nom, :prenom)');
$req->execute(array(
	'nom' => $nom,
	'prenom' => $prenom,
	));

echo 'La personne a bien été ajouté !';
?>