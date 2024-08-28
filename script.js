
class Despesas{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados(){
        let dataValida = validar()
        for(let i in this){
            if(this[i] == null || this[i] == undefined || this[i] == '' || this[i] == ' ' || dataValida == false){
                return false
            } 
        }
        return true
    }
}
class Bd{
    constructor(){
        let valorId = localStorage.getItem('id')
        if(valorId === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem('id', id)
        
        localStorage.setItem(id, JSON.stringify(d))

    }
    consultarrDespesas(){
        let listaDespesas = Array()
        let id = localStorage.getItem('id')
        console.log(id)
        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa !== null){
                despesa.id = i
                listaDespesas.push(despesa)         
            }
        }
        return listaDespesas
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()
        
        despesasFiltradas = this.consultarrDespesas()
        
        if(despesa.ano != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)

        }
        if(despesa.tipo != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
            if(despesa.mes != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        }
        if(despesa.descricao != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.valor != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    removeItem(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    console.log((ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value))

    let despesa = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if(despesa.validarDados()){
        bd.gravar(despesa)

        $('#modalRegistraDespesa').modal('show')

        let tituloConclucao = document.getElementById('modalRegistraDespesaLabel')
        tituloConclucao.innerHTML = 'Despesa Cadastrada Com Sucesso'
        tituloConclucao.classList = 'text-danger'.remove
        tituloConclucao.className = 'text-success'
        
        let descricaoConclucao = document.getElementById('modal-text')
        descricaoConclucao.innerHTML= 'Todos os campos obrigatórios foram preenchidos'

        let btnConclucao = document.getElementById('btn_modal')
        btnConclucao.classList = 'btn-danger'.remove
        btnConclucao.className = 'btn-success'
        btnConclucao.innerHTML = 'Concluir'

        ano.value = '' 
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value =  ''
        valor.value =''
    }
    else{

        $('#modalRegistraDespesa').modal('show')

        let tituloErro = document.getElementById('modalRegistraDespesaLabel')
        tituloErro.innerHTML = 'Erro na gravação'
        tituloErro.classList = 'text-success'.remove
        tituloErro.className = 'text-danger'
        
        let descricaoErro = document.getElementById('modal-text')
        descricaoErro.innerHTML= 'Existem campos obrigatórios que não foram preenchidos ou contem dados inválidos'

        let btnErro = document.getElementById('btn_modal')
        btnErro.classList = 'btn-success'.remove
        btnErro.className = 'btn-danger'
        btnErro.innerHTML = 'Editar Campos'
    } 
}
function carregarDespesasCadastradas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.consultarrDespesas()
    }

    let tabela = document.getElementById('lista_despesas')

    tabela.innerHTML = ''

    despesas.forEach(function(d){

        let linha = tabela.insertRow()

        console.log(d)
        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano} `
        switch (parseInt(d.tipo)) {
            case 1:
                d.tipo = 'Alimentação'
                break;
            case 2:
                d.tipo = 'Educação'
                break;
            case 3: 
                d.tipo = 'Lazer'
                break;
            case 4:
                d.tipo = 'Saúde'
                break;
            default:
                d.tipo = 'Transporte'
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.id = `id_despesa_${d.id}`
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function () { 
            let id = this.id.replace('id_despesa_', '')    
            bd.removeItem(id)
            $('#modalExclucaoDespesa').modal('show')   
        }
        let modalReload = document.getElementById('btn_modal')
        modalReload.onclick = () => window.location.reload()

        

        linha.insertCell(4).append(btn)
    }
    )
}

function pesquisarDespesas(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    
    let despesaPesquisada = new Despesas(ano, mes, dia, tipo, descricao, valor)

    let resultadoPesquisa =  bd.pesquisar(despesaPesquisada)   

    carregarDespesasCadastradas(resultadoPesquisa, true)

}
function validar(){
    let dia = document.getElementById('dia').value
    let mes = document.getElementById('mes').value
    let ano = document.getElementById('ano').value
    let valor = document.getElementById('valor').value
    if( 
        dia < 1 || 
        dia > 31 ||
        mes == 2 && dia > 29 || 
        mes == 2 && dia > 28 && ano == 2025 ||
        mes == 4 && dia == 31|| 
        mes == 6 && dia == 31|| 
        mes == 9 && dia == 31|| 
        mes == 11 && dia == 31
    
    )
    {
        let dia = document.getElementById('dia')
        dia.value = ""
        dia.style.border= '1px solid red'
        return false
        
    } 
    else if(valor < 0 ){
        let valor = document.getElementById('valor')
        valor.value = ""
        valor.style.border= '1px solid red'
        return false
    }
    return true
}
