/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "RiskBattleCalculator.js"
*
* Project: Risk Battle Calculator
*
* Purpose: Simulate a dice roll battle in the board game Risk.
*
* Author: Tom McDonnell 2011-07-25.
*
\**************************************************************************************************/

/*
 *
 */
function RiskBattleCalculator()
{
   var f = 'RiskBattleCalculator()';
   UTILS.checkArgs(f, arguments, []);

   // Privileged functions. /////////////////////////////////////////////////////////////////////

   this.getDiv = function () {return _domElements.divs.main;}

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function _onClickClearForm(e)
   {
      try
      {
         var f = 'RiskBattleCalculator._onClickClearForm()';
         UTILS.checkArgs(f, arguments, [Object]);

         var selectors = _inputs.selectors;
         $(selectors.nAttackers  ).attr('selectedIndex', 0);
         $(selectors.nDefenders  ).attr('selectedIndex', 0);
         $(selectors.minAttackers).attr('selectedIndex', 0);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _onClickAttack(e)
   {
      try
      {
         var f = 'RiskBattleCalculator._onClickAttack()';
         UTILS.checkArgs(f, arguments, [Object]);

         var o             = _getSelectedValuesAsObject();
         _state.logEntries = _simulateAttack(o.nAttackers, o.nDefenders, o.minAttackers);

         _printAttackSimulationLogToPage();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _onClickAnalyse(e)
   {
      try
      {
         var f = 'RiskBattleCalculator._onClickAnalyse()';
         UTILS.checkArgs(f, arguments, [Object]);

         var o             = _getSelectedValuesAsObject();
         var probabilities = _getProbabilities(o.nAttackers, o.nDefenders, o.minAttackers);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   // Other private functions. ----------------------------------------------------------------//

   /*
    *
    */
   function _getSelectedValuesAsObject()
   {
      var f = 'RiskBattleCalculator._getSelectedValuesAsObject()';
      UTILS.checkArgs(f, arguments, []);

      var selectors = _inputs.selectors;
      var o         =
      {
         nAttackers  : Number($(selectors.nAttackers  ).attr('value')),
         nDefenders  : Number($(selectors.nDefenders  ).attr('value')),
         minAttackers: Number($(selectors.minAttackers).attr('value'))
      };

      return o;
   }

   /*
    *
    */
   function _getProbabilities(nAttackers, nDefenders, minAttackers)
   {
      var f = 'RiskBattleCalculator._getProbabilities()';
      UTILS.checkArgs(f, arguments, ['positiveInt', 'positiveInt', 'nonNegativeInt']);
   }

   /*
    *
    */
   function _simulateAttack(nAttackers, nDefenders, minAttackers)
   {
      var f = 'RiskBattleCalculator._simulateAttack()';
      UTILS.checkArgs(f, arguments, ['positiveInt', 'positiveInt', 'nonNegativeInt']);

      var logEntries = [];

      function reverseCompare(a, b) {return b - a;}

      while (nAttackers > minAttackers && nDefenders > 0)
      {
         var nRollsAttacker          = (nAttackers > 2)? 3: (nAttackers > 1)? 2: 1;
         var nRollsDefender          = (nDefenders > 1)? 2: 1;
         var diceRollResultsAttacker = _rollDice(nRollsAttacker);
         var diceRollResultsDefender = _rollDice(nRollsDefender);
         var nAttackersLost          = 0;
         var nDefendersLost          = 0;

         diceRollResultsAttacker.sort(reverseCompare);
         diceRollResultsDefender.sort(reverseCompare);

         for (var i = 0, len = Math.min(nRollsAttacker, nRollsDefender); i < len; ++i)
         {
            switch (diceRollResultsAttacker[i] > diceRollResultsDefender[i])
            {
             case true : ++nDefendersLost; break;
             case false: ++nAttackersLost; break;
            }
         }

         logEntries.push
         (
            {
               nAttackersPre          : nAttackers             ,
               nDefendersPre          : nDefenders             ,
               diceRollResultsAttacker: diceRollResultsAttacker,
               diceRollResultsDefender: diceRollResultsDefender,
               nAttackersLost         : nAttackersLost         ,
               nDefendersLost         : nDefendersLost
            }
         );

         nAttackers -= nAttackersLost;
         nDefenders -= nDefendersLost;
      }

      return logEntries;
   }

   /*
    *
    */
   function _rollDice(nDice)
   {
      var f = 'RiskBattleCalculator._rollDice()';
      UTILS.checkArgs(f, arguments, ['positiveInt']);

      var diceRollResults = [];

      for (var i = 0; i < nDice; ++i)
      {
         diceRollResults.push(Math.ceil(Math.random() * 6));
      }

      return diceRollResults;
   }

   /*
    *
    */
   function _printAttackSimulationLogToConsole()
   {
      var f = 'RiskBattleCalculator._printAttackSimulationToConsole()';
      UTILS.checkArgs(f, arguments, []);

      var logEntries = _state.logEntries;

      for (var i = 0; i < logEntries.length; ++i)
      {
         var logEntry = logEntries[i];

         console.group();

         for (var key in logEntry)
         {
            console.debug(key + ': ' + logEntry[key]);
         }

         console.groupEnd();
      }
   }

   /*
    *
    */
   function _printAttackSimulationLogToPage()
   {
      var f = 'RiskBattleCalculator._printAttackSimulationToPage()';
      UTILS.checkArgs(f, arguments, []);

      if (_state.logEntries === null)
      {
         throw new Exception('Battle log is null.');
      }

      var divs           = _domElements.divs;
      var battleLogDivJq = $(divs.battleLog);
      var logEntries     = _state.logEntries;

      $(divs.simulationSummary).text(_getSimulationSummaryString());
      $(divs.battleLog        ).html(''                           );

      for (var i = 0; i < logEntries.length; ++i)
      {
         var logEntry = logEntries[i];
         var liJq     = $(LI());
         liJq.append(_getLogEntryLongDescriptionAsSpan(logEntry));
         battleLogDivJq.append(liJq);
      }
   }

   /*
    * TODO
    * ----
    * Write battle log as chronicle in text fitting theme.
    * "(Attacker rolls 5,4 defender rolls 2,3)
    *  Then Hector cast his spear at Diomedes, killing him.
    *  His eyes rolled back as his head hit the dust."
    */
   function _getLogEntryLongDescriptionAsSpan(logEntry)
   {
      UTILS.validator.checkObject
      (
         logEntry,
         {
            nAttackersPre          : 'positiveInt'   ,
            nDefendersPre          : 'positiveInt'   ,
            diceRollResultsAttacker: 'nonEmptyArray' ,
            diceRollResultsDefender: 'nonEmptyArray' ,
            nAttackersLost         : 'nonNegativeInt',
            nDefendersLost         : 'nonNegativeInt'
         }
      );

      var nAttackersPost = logEntry.nAttackersPre - logEntry.nAttackersLost;
      var nDefendersPost = logEntry.nDefendersPre - logEntry.nDefendersLost;

      return PRE
      (
         "Attacker's dice    : " + logEntry.diceRollResultsAttacker.join(', ')          + '\n'  +
         "Defender's dice    : " + logEntry.diceRollResultsDefender.join(', ')          + '\n'  +
         'Attackers remaining: ' + nAttackersPost + ' (lost ' + logEntry.nAttackersLost + ')\n' +
         'Defenders remaining: ' + nDefendersPost + ' (lost ' + logEntry.nDefendersLost + ')\n'
      );
   }

   /*
    *
    */
   function _getSimulationSummaryString()
   {
      var f = 'RiskBattleCalculator._getSimulationSummaryString()';
      UTILS.checkArgs(f, arguments, []);

      if (_state.logEntries === null)
      {
         throw new Exception('Battle log is null.');
      }

      var numToWords       = new NumToWords();
      var logEntries       = _state.logEntries;
      var firstLogEntry    = logEntries[0                    ];
      var finalLogEntry    = logEntries[logEntries.length - 1];
      var nRounds          = logEntries.length;
      var finalNAttackers  = finalLogEntry.nAttackersPre - finalLogEntry.nAttackersLost;
      var finalNDefenders  = finalLogEntry.nDefendersPre - finalLogEntry.nDefendersLost;
      var boolAttackerWins = (finalNDefenders == 0);
      var totalLossesA     = firstLogEntry.nAttackersPre - finalNAttackers;
      var totalLossesD     = firstLogEntry.nDefendersPre - finalNDefenders;
      var roundsStr        = numToWords.convert(nRounds) + ' round' + ((nRounds > 1)? 's'  : '' );
      var armiesStr        =
      (
         (totalLossesA == 0)? 'no armies':
         numToWords.convert(totalLossesA) + ' arm' + ((totalLossesA > 1)? 'ies': 'y')
      );

      return s =
      (
         (boolAttackerWins)?
         'The attacker was victorious after ' + roundsStr + ' and the loss of ' + armiesStr + '.'
         :
         'The attacker ' +
         ((finalNAttackers == 0)? 'was defeated': 'retreated') +
         ' after ' + roundsStr + ' having lost ' + armiesStr + '.' +
         ' The defender ' + ((totalLossesA == totalLossesD)? 'also ': '') +
         'lost ' + ((totalLossesD == 0)? 'none': numToWords.convert(totalLossesD)) + '.'
      );

      // TODO
      // ----
      // Add another short message following the numerical battle summary, depending
      // on the numbers killed and the ratio of attackers killed to defenders killed..
      // Something like 'The battle will be remembered as a bloodbath.
      // Add a theme selector {Iliad, WW2, WW1, etc.}
      // 'The mighty hand of Zeus thundercloud surely favoured the defenders.'
      // Allow input of attacker and defender names, and supply a toggle button to switch them.
      // Themes have default attacker and defender names eg. for Iliad, Trojans and Achaians.
   }

   // Initialisation functions. ---------------------------------------------------------------//

   /*
    *
    */
   function _init()
   {
      var f = 'RiskBattleCalculator._init()';
      UTILS.checkArgs(f, arguments, []);

      _fillSelectors();

      var divs    = _domElements.divs;
      var tables  = _domElements.tables;
      var buttons = _inputs.buttons;

      $(_domElements.divs.main).append
      (
         tables.form           ,
         buttons.analyse       ,
         buttons.attack        ,
         buttons.clearForm     ,
         BR()                  ,
         divs.simulationSummary,
         divs.battleLog
      );

      $(buttons.analyse  ).click(_onClickAnalyse  );
      $(buttons.attack   ).click(_onClickAttack   );
      $(buttons.clearForm).click(_onClickClearForm);
   }

   /*
    *
    */
   function _fillSelectors()
   {
      var f = 'RiskBattleCalculator._fillSelectors()';
      UTILS.checkArgs(f, arguments, []);

      var selectors              = _inputs.selectors;
      var nAttackersSelectorJq   = $(selectors.nAttackers  );
      var nDefendersSelectorJq   = $(selectors.nDefenders  );
      var minAttackersSelectorJq = $(selectors.minAttackers);

      for (var i = 1; i <= 100; ++i)
      {
         nAttackersSelectorJq.append(OPTION(String(i)));
         nDefendersSelectorJq.append(OPTION(String(i)));
         minAttackersSelectorJq.append(OPTION(String(i - 1)));
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _inputs =
   {
      selectors:
      {
         nAttackers  : SELECT(),
         nDefenders  : SELECT(),
         minAttackers: SELECT()
      },
      buttons:
      {
         analyse  : INPUT({type: 'button', 'class': 'button', value: 'Analyse\nProbabilities'}),
         attack   : INPUT({type: 'button', 'class': 'button', value: 'Simulate\nAttack'      }),
         retreat  : INPUT({type: 'button', 'class': 'button', value: 'Retreat'               }),
         clearForm: INPUT({type: 'button', 'class': 'button', value: 'Clear\nForm'           })
      }
   };

   var _domElements =
   {
      divs:
      {
         main             : DIV({'class': 'riskBattleCalculator'}),
         simulationSummary: DIV({'class': 'simulationSummary'   }),
         battleLog        : OL({'class': 'battleLog'           })
      },
      tables:
      {
         form:
         (
            TABLE
            (
               {'class': 'riskBattleCalculatorForm'},
               TBODY
               (
                  TR(TH('Attacking Armies:'), TD(_inputs.selectors.nAttackers)),
                  TR(TH('Defending Armies:'), TD(_inputs.selectors.nDefenders)),
                  TR
                  (
                     TH('Attack until fewer than attacking armies remain'),
                     TD(_inputs.selectors.minAttackers)
                  )
               )
            )
         )
      }
   };

   var _state =
   {
      logEntries: null
   };

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}

/*******************************************END*OF*FILE********************************************/
