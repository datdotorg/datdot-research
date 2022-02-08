# Existential Deposit (=ED)
* `balance` pallet
* minimum balance accounts may have.
* no accounts with less than `ED`
* accounts delete if balance drops below

* having `ED`, `deposit`, `transfer`

* if transfered amount < ED
  * destination doesn't exist yet
  * receiver will not be created
  * => burns funds
* if transfer takes sender < ED
  * account deletes