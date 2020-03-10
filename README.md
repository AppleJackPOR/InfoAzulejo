# InfoAzulejo
Projeto elaborado por: Hugo Varela

## Enquadramento:
Os azulejos são muitas vezes associados à cobertura de superfícies, pelo que está relacionado a arquitetura em muitos casos. Em Portugal a sua utilização foi elevada, sendo uma referência não apenas histórica, como artística também. Por estes motivos, há uma necessidade de apoiar na partilha de património, não só aos portugueses, como a estrangeiros numa plataforma *web*, sendo o objetivo principal deste projeto ajudar na recolha e tratamento de informação sobre azulejos incluindo imagens, anotações e localizações.

A obtenção de informação relativa a azulejos será feita com recurso a *crowdsourcing*, necessitando de aprovação por parte de *staff*. Esta informação pode ser editada, caso haja necessidade. Esta informação submetida terá o nome de “sessão” e permitirá guardar um ou mais azulejos (é feita referência a este termo no cenário principal).

Não há aplicações semelhantes, porém há roteiros/sítios com sugestões de locais com azulejos para visitar, sendo estes mencionados nas referências. A diferença do website que será desenvolvido é a possibilidade de navegar no mapa para se procurar azulejos, assim como submeter os que o utilizador quiser.<br/>


## Cenários:
### Principal
   Ao entrar no *website*, o utilizador pode abrir o mapa relativo aos azulejos existentes, ao fazer isso pode navegar nele e observar as localizações de cada azulejo submetido. Para além disso, poderá submeter azulejos, sendo necessário enviar uma imagem, anotações e localização, esta informação é guardada numa ou mais sessões.

### Secundários   
1. Um elemento da *staff* pode aceder ao menu de submissões, neste pode avaliar a informação relativa a cada azulejo e, caso seja aprovado, este passará a estar disponível no mapa.<br/>
2. Quando um utilizador navega no mapa, se achar pertinente, poderá submeter uma edição da informação relativa a um azulejo. Essa aprovação é realizada com recurso ao cenário secundário 1.


## Plano de Trabalho:<br/>
A estruturação será feita por ordem, seguida de duração média e as atividades associadas a cada fase.<br/>
### Fases:<br/>
1. Elaboração da proposta de projeto (1 semana). :+1: <br/>
2. Elaboração de *mockups* (2 dias).<br/>
3. Elaboração do modelo de dados (2/3 dias). :+1: <br/> 
4. Elaboração do *Project Charter* (4 dias).<br/>
5. Criar e popular a base de dados (1 semana).<br/>
6. *Setup* do servidor (1 dia).<br/>
7. Início do desenvolvimento do cenário principal (2 semanas):<br/>
   - Página Inicial (Escolher entre aceder ao mapa ou descobrir mais informação sobre azulejos);<br/>
   - Página do Mapa:<br/>
     -Apresentar o mapa com os azulejos.<br/>
     -Possibilidade de submeter azulejos.<br/>
8. Desenvolvimento do lado staff (2 semanas):<br/>
   - Página de Submissões (Rever e aceitar submissões).<br/>
9. Implementação de funcionalidades de menor prioridade (2 semanas):<br/>
   - Editar informação de azulejos;<br/>
   - Procura por localização;<br/>
   - Página de Perfil.<br/>
10. Elaboração da documentação para a entrega final (2 semanas).
