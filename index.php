<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go -=b
*
* Filename: "index.php"
*
* Project: Risk Battle Calculator
*
* Purpose: The main file for the project.
*
* Author: Tom McDonnell 2011-07-24.
*
\**************************************************************************************************/

// Global variables. ///////////////////////////////////////////////////////////////////////////////

$filenamesCss = array
(
   'style.css'
);

$filenamesJs = array
(
   '../library/tom/js/contrib/jquery/1.5/jquery_minified.js',
   '../library/tom/js/contrib/utils/DomBuilder.js'          ,
   '../library/tom/js/utils/NumToWords.js'                  ,
   '../library/tom/js/utils/utils.js'                       ,
   '../library/tom/js/utils/utilsValidator.js'              ,
   'RiskBattleCalculator.js'                                ,
   'index.js'
);

// HTML code. //////////////////////////////////////////////////////////////////////////////////////
?>
<!DOCTYPE html PUBLIC
 "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
 <head>
<?php
 $timestamp = time();
 foreach ($filenamesCss as $filename)
 {
?>
  <link rel='stylesheet' type='text/css' href='<?php echo "$filename?$timestamp"; ?>'/>
<?php
 }

 foreach ($filenamesJs as $filename)
 {
?>
  <script type='text/javascript' src='<?php echo "$filename?$timestamp"; ?>'></script>
<?php
 }
?>
  <title>Risk Battle Calculator</title>
 </head>
 <body>
  <h1>Risk Battle Calculator</h1>
 </body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
