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

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/lib_tom/php/utils/UtilsHtml.php';

// HTML code. //////////////////////////////////////////////////////////////////////////////////////
?>
<!DOCTYPE html>
<html>
 <head>
<?php
UtilsHtml::echoHtmlScriptAndLinkTagsForJsAndCssFiles
(
   array
   (
      'style.css'
   ),
   array
   (
      'lib_tom/js/contrib/jquery/1.5/jquery_minified.js',
      'lib_tom/js/contrib/utils/DomBuilder.js'          ,
      'lib_tom/js/utils/NumToWords.js'                  ,
      'lib_tom/js/utils/utils.js'                       ,
      'lib_tom/js/utils/utilsObject.js'                 ,
      'lib_tom/js/utils/utilsValidator.js'              ,
      'RiskBattleCalculator.js'                         ,
      'index.js'
   )
);
?>
  <title>Risk Battle Calculator</title>
 </head>
 <body></body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
