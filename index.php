<?php
/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go -=b
*
* Filename: "index.php"
*
* Project: Risk Battle Simulator
*
* Purpose: The main file for the project.
*
* Author: Tom McDonnell 2011-07-24.
*
\**************************************************************************************************/

// Includes. ///////////////////////////////////////////////////////////////////////////////////////

require_once dirname(__FILE__) . '/../../lib/tom/php/utils/UtilsHtml.php';

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
      '../../lib/tom/js/contrib/jquery/1.7/jquery_minified.js',
      '../../lib/tom/js/contrib/utils/DomBuilder.js'          ,
      '../../lib/tom/js/utils/NumToWords.js'                  ,
      '../../lib/tom/js/utils/utils.js'                       ,
      '../../lib/tom/js/utils/utilsObject.js'                 ,
      '../../lib/tom/js/utils/utilsValidator.js'              ,
      'RiskBattleSimulator.js'                                ,
      'index.js'
   )
);
?>
  <title>Risk Battle Simulator</title>
 </head>
 <body></body>
</html>
<?php
/*******************************************END*OF*FILE********************************************/
?>
