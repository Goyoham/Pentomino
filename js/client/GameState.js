state = {
    Begin: 0,

    MainPage: 0,
    ChoicePage: 1,
    GamePage: 2,
    RankingPage: 3,

    Max: 4,
}

function GameState(){}
_gameState = new GameState();

GameState.prototype.myState = state.MainPage;

GameState.prototype.GetState = function(){
    return this.myState;
}

GameState.prototype.SetState = function(state_){
    if( state_ < state.Begin || state_ >= state.Max )
        return;
    
    // close page
    switch( this.GetState() ){
        case state.MainPage:        mainPage.CloseMainPage(); break;
        case state.ChoicePage:      choicePage.CloseChoicePage(); break;
        case state.GamePage:        createGameMgr.CloseGame(); break;
        case state.RankingPage:     rankingPage.CloseRankingPage(); break;
        default:
            return;
    }

    // show page
    switch( state_ ){
        case state.MainPage:        mainPage.ShowMainPage(); break;
        case state.ChoicePage:      choicePage.ShowChoicePage(); break;
        case state.GamePage:        createGameMgr.ShowGamePage(); break;
        case state.RankingPage:     rankingPage.ShowRankingPage(); break;
        default:
            this.SetState( this.GetState() ); // rollback
            return;
    }

    console.log('state '+state_+' -> '+this.myState);
    this.myState = state_;
}
