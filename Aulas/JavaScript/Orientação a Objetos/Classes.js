class ContaBancaria {
    constructor(agencia, numero, tipo){
        this.agencia = agencia;
        this.numero = numero;
        this._tipo = tipo;
        this._saldo = 0;
    }

    get tipo(){
        return this._tipo;
    }

    get saldo(){
        return this._saldo;
    }

    set saldo(novoSaldo){
        this._saldo = novoSaldo;
    }

    sacar(valorASacar){
        if(this._saldo >= valorASacar){
            let saldoAntigo = this._saldo;
            this ._saldo = this._saldo - valorASacar;
            return `Saque realizado.\nSaldo antigo: ${saldoAntigo}\nSaldo atual: ${this._saldo}`;
        } else{
            return `Valor de saque solicitado maior que o saldo disponível.\nSaldo atual: ${this._saldo}`;
        }
    }

    depositar(valorADepositar){
        let saldoAntigo = this._saldo;
        this._saldo = this._saldo + valorADepositar;

        return `Deposito realizado.\nSaldo antigo: ${saldoAntigo}\nSaldo atual: ${this._saldo}`;
    }
}

class ContaCorrente extends ContaBancaria {
    constructor(agencia, numero, cartaoCredito){
        super(agencia, numero, 'Conta corrente');
        this._cartaoCredito = cartaoCredito;
    }

    get cartaoCredito(){
        return this._cartaoCredito;
    }

    set cartaoCredito(valor){
        this._cartaoCredito = valor;
    }
}

class ContaPoupanca extends ContaBancaria {
    constructor(agencia, numero){
        super(agencia, numero, 'Conta poupança');
    }
}

class ContaUniversitaria extends ContaBancaria {
    constructor(agencia, numero){
        super(agencia, numero, 'Conta universitária');
    }

    sacar(valorASacar){
        if(valorASacar > 500){
            return 'Contas universitárias não podem sacar valores maiores que 500.';
        }
        else{
            return super.sacar(valorASacar);
        }
    }
}

let contaBancaria = new ContaBancaria(1, 1, 'Conta bancaria');

console.log(contaBancaria.tipo);

console.log(contaBancaria.saldo);
contaBancaria.saldo = 10000;
console.log(contaBancaria.saldo);

console.log(contaBancaria.sacar(5000));
console.log(contaBancaria.sacar(5000));
console.log(contaBancaria.sacar(5000));

console.log(contaBancaria.depositar(1000));


let contaCorrente = new ContaCorrente(1, 2, false);

console.log(contaCorrente.tipo);

console.log(contaCorrente.cartaoCredito);
contaCorrente.cartaoCredito = true;
console.log(contaCorrente.cartaoCredito);

console.log(contaCorrente.saldo);
console.log(contaCorrente.depositar(500));
console.log(contaCorrente.sacar(200));


let contaPoupanca = new ContaPoupanca(1, 3);

console.log(contaPoupanca.tipo);

console.log(contaPoupanca.saldo);
console.log(contaPoupanca.depositar(500));
console.log(contaPoupanca.sacar(200));

let contaUniversitaria = new ContaUniversitaria(1, 4);

console.log(contaUniversitaria.tipo);

console.log(contaUniversitaria.saldo);
console.log(contaUniversitaria.depositar(500));
console.log(contaUniversitaria.depositar(1500));
console.log(contaUniversitaria.sacar(2000));
console.log(contaUniversitaria.sacar(500));

