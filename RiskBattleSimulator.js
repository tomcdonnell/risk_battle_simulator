/**************************************************************************************************\
*
* vim: ts=3 sw=3 et wrap co=100 go-=b
*
* Filename: "RiskBattleSimulator.js"
*
* Project: Risk Battle Simulator
*
* Purpose: Simulate a dice roll battle in the board game Risk.
*
* Author: Tom McDonnell 2011-07-25.
*
\**************************************************************************************************/

/*
 *
 */
function RiskBattleSimulator()
{
   var f = 'RiskBattleSimulator()';
   UTILS.checkArgs(f, arguments, []);

   // Privileged functions. /////////////////////////////////////////////////////////////////////

   this.getDiv = function () {return _domElements.divs.main;}

   // Private functions. ////////////////////////////////////////////////////////////////////////

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function _onClickClearForm(ev)
   {
      try
      {
         var f = 'RiskBattleSimulator._onClickClearForm()';
         UTILS.checkArgs(f, arguments, ['object']);

         var selectors = _inputs.selectors;

         $(selectors.nAttackers  ).attr('selectedIndex', _nArmiesDefault - 1);
         $(selectors.nDefenders  ).attr('selectedIndex', _nArmiesDefault - 1);
         $(selectors.minAttackers).attr('selectedIndex', 0);
         $(_domElements.ols.battleLog     ).html('');
         $(_domElements.divs.battleSummary).html('');
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _onChangeNAttackers(ev)
   {
      try
      {
         var f = 'RiskBattleSimulator._onChangeNAttackers()';
         UTILS.checkArgs(f, arguments, ['object']);

         var nAttackers = $(_inputs.selectors.nAttackers).val();
         var options    = _inputs.selectors.minAttackers.options;

         for (var i = 0; i < _nArmiesMax; ++i)
         {
             options[i].disabled = (i >= nAttackers);
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _onClickAttack(ev)
   {
      try
      {
         var f = 'RiskBattleSimulator._onClickAttack()';
         UTILS.checkArgs(f, arguments, ['object']);

         var o = _getSelectedValuesAsObject();
         _simulateAttack(o.nAttackers, o.nDefenders, o.minAttackers);
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
   function _onClickAnalyse(ev)
   {
      try
      {
         var f = 'RiskBattleSimulator._onClickAnalyse()';
         UTILS.checkArgs(f, arguments, ['object']);

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
      var f = 'RiskBattleSimulator._getSelectedValuesAsObject()';
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
      var f = 'RiskBattleSimulator._getProbabilities()';
      UTILS.checkArgs(f, arguments, ['positiveInt', 'positiveInt', 'nonNegativeInt']);
   }

   /*
    * Simulate a battle and write the results to the _logEntries array.
    */
   function _simulateAttack(nAttackers, nDefenders, minAttackers)
   {
      var f = 'RiskBattleSimulator._simulateAttack()';
      UTILS.checkArgs(f, arguments, ['positiveInt', 'positiveInt', 'nonNegativeInt']);

      _logEntries = [];

      function reverseCompare(a, b) {return b - a;}

      // Note Regarding MinAttackers
      // ---------------------------
      // minAttackers is the number of armies the attacking general wishes to retreat
      // with in a failed attack.  Hence if minAttackers remain, it is time to retreat.
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

         _logEntries.push
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
   }

   /*
    *
    */
   function _rollDice(nDice)
   {
      var f = 'RiskBattleSimulator._rollDice()';
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
   function _printAttackSimulationLogToPage()
   {
      var f = 'RiskBattleSimulator._printAttackSimulationToPage()';
      UTILS.checkArgs(f, arguments, []);

      if (_logEntries === null)
      {
         throw new Exception('Battle log is null.');
      }

      var battleLogOlJq = $(_domElements.ols.battleLog);

      $(_domElements.divs.battleSummary).text(_getSimulationSummaryString());
      $(_domElements.ols.battleLog     ).html(''                           );

      for (var i = 0; i < _logEntries.length; ++i)
      {
         var logEntry = _logEntries[i];
         var liJq     = $(LI());
         liJq.append(_getLogEntryLongDescriptionAsSpan(logEntry));
         battleLogOlJq.append(liJq);
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
      var f = 'RiskBattleSimulator._getSimulationSummaryString()';
      UTILS.checkArgs(f, arguments, []);

      if (_logEntries === null)
      {
         throw new Exception('Battle log is null.');
      }

      var numToWords       = new NumToWords();
      var firstLogEntry    = _logEntries[0                     ];
      var finalLogEntry    = _logEntries[_logEntries.length - 1];
      var nRounds          = _logEntries.length;
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
      var f = 'RiskBattleSimulator._init()';
      UTILS.checkArgs(f, arguments, []);

      _fillSelectors();

      var divs      = _domElements.divs;
      var buttons   = _inputs.buttons;
      var selectors = _inputs.selectors;

      $(_domElements.divs.main).append
      (
         _domElements.tables.form,
         divs.battleSummary      ,
         DIV({'class': 'battleLog'}, _domElements.ols.battleLog)
      );

      $(buttons.analyse  ).click(_onClickAnalyse  );
      $(buttons.attack   ).click(_onClickAttack   );
      $(buttons.clearForm).click(_onClickClearForm);

      $(selectors.nAttackers).change(_onChangeNAttackers);
      $(selectors.nAttackers).change();

      buttons.analyse.disabled = true;
   }

   /*
    *
    */
   function _fillSelectors()
   {
      var f = 'RiskBattleSimulator._fillSelectors()';
      UTILS.checkArgs(f, arguments, []);

      var selectors              = _inputs.selectors;
      var nAttackersSelectorJq   = $(selectors.nAttackers  );
      var nDefendersSelectorJq   = $(selectors.nDefenders  );
      var minAttackersSelectorJq = $(selectors.minAttackers);

      for (var i = 1; i <= _nArmiesMax; ++i)
      {
         var attrs = (i == _nArmiesDefault)? {selected: 'selected'}: {};
         nAttackersSelectorJq.append(OPTION(attrs, String(i)));
         nDefendersSelectorJq.append(OPTION(attrs, String(i)));
         minAttackersSelectorJq.append(OPTION({value: i - 1}, (i == 1)? 'N/A': String(i - 1)));
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

   var _nArmiesDefault     = 50;
   var _nArmiesMax         = 100;
   var _logEntries         = null;
   var _stopLossLimitTitle = 'Retreat when this number of attacking armies remain';
   var _domElements        =
   {
      divs:
      {
         main         : DIV({'class': 'riskBattleSimulator'}),
         battleSummary: DIV({'class': 'battleSummary'      })
      },
      ols:
      {
         battleLog: OL({'class': 'battleLog'})
      },
      tables:
      {
         form:
         (
            TABLE
            (
               {'class': 'riskBattleSimulatorForm'},
               TBODY
               (
                  TR(TH({colspan: 3}, H1('Risk Battle Simulator')                         )),
                  TR(TH({colspan: 2}, 'Attacking Armies'), TD(_inputs.selectors.nAttackers)),
                  TR(TH({colspan: 2}, 'Defending Armies'), TD(_inputs.selectors.nDefenders)),
                  TR
                  (
                     TH({title: _stopLossLimitTitle, colspan: 2}, 'Stop loss limit' ),
                     TD({title: _stopLossLimitTitle}, _inputs.selectors.minAttackers)
                  ),
                  TR
                  (
                     TD(_inputs.buttons.analyse  ),
                     TD(_inputs.buttons.attack   ),
                     TD(_inputs.buttons.clearForm)
                  )
               )
            )
         )
      }
   };

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}

/*******************************************END*OF*FILE********************************************/
