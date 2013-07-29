/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "index.js"
*
* Project: Risk Battle Simulator
*
* Purpose: Start JavaScripts.
*
* Author: Tom McDonnell 2011-07-25.
*
\**************************************************************************************************/

$(document).ready
(
    function (ev)
    {
        try
        {
            var f = 'onReady()';
            UTILS.checkArgs(f, arguments, ['function']);

            window.rbc = new RiskBattleSimulator();

            $('body').append(rbc.getDiv());
        }
        catch (e)
        {
            UTILS.printExceptionToConsole(f, e);
        }
    }
);

/*******************************************END*OF*FILE********************************************/
