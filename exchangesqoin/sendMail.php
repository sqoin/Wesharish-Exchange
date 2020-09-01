<?php
#use PHPMailer\PHPMailer\PHPMailer;
#use PHPMailer\PHPMailer\Exception;
require 'app/vendor/autoload.php';
require 'app/vendor/phpmailer/phpmailer/class.phpmailer.php'; 
require 'app/vendor/phpmailer/phpmailer/class.smtp.php';
require 'app/vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
require './vendor/phpmailer/phpmailer/src/Exception.php';
require './vendor/phpmailer/phpmailer/src/PHPMailer.php';
require './vendor/phpmailer/phpmailer/src/SMTP.php';
$mail = new PHPMailer(true); 
try {
    //Server settings
    $mail->SMTPDebug = 2;
   $mail->isSMTP();
    $mail->Host = 'mail.privateemail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'admin@sqoin.us';
    $mail->Password = '24a4BsE2xYDdq88CVRbJ';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
 
    $mail->setFrom('admin@sqoin.us', 'Admin');
    $mail->addAddress('sellamiemna88@gmail.com', 'Recipient1');
   # $mail->addAddress('recipient2@example.com');
    #$mail->addReplyTo('noreply@example.com', 'noreply');
  #  $mail->addCC('cc@example.com');
   # $mail->addBCC('bcc@example.com');
 
    //Attachments
  #  $mail->addAttachment('/backup/myfile.tar.gz');
 
    //Content
    $mail->isHTML(true); 
    $mail->Subject = 'Test Mail Subject!';
    $mail->Body    = 'This is SMTP Email Test';
 
    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
}
