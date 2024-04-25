class Game {
    constructor() {
        this.over = false
        this.gamePoused = false
        this.player1 = null
        this.player2 = null
        this.isWinner = false
        this.ball = null
        this.board = null
        this.player1Score = 0
        this.player2Score = 0
        this.speed = 20
        this.ballSpeed = 5
        this.timeToUpdate = 20
        this.ballDirections = ['DL', 'DR', 'UR', 'UL']
        this.currentBallDirection = null
    }
    
    GetBoard() {
        const board = document.querySelector('#board')
        this.board = board
    }

    CreateBall() {
        const board = document.querySelector('#board')
        const ball = document.createElement('div')
        board.appendChild(ball)
        ball.id = "ball"
        this.ball = ball
    }

    GetPlayers() {
        const player1 = document.querySelector('.player-1')
        const player2 = document.querySelector('.player-2')
        this.player1 = player1
        this.player2 = player2
    }

    InitializeEntities() {
        this.GetBoard()
        this.GetPlayers()
        this.CreateBall()
    }

    GetInitialDirection() {
        const ballInitialDirectionIndex = Math.floor(Math.random() * 2)
        this.currentBallDirection = this.ballDirections[ballInitialDirectionIndex]
    }
    
    ResetBallPosition() {
        this.ball.style.top = 0 + 'px'
        this.ball.style.left = this.board.offsetWidth / 2 + 'px'
    }

    UpdateScore() {
        const player1Score = document.querySelector('.player-1-score')
        const player2Score = document.querySelector('.player-2-score')
        player1Score.textContent = this.player1Score
        player2Score.textContent = this.player2Score
    }

    VerifyBallAndBoardColision(positionTop, positionLeft) {

        // Ponto player 1
        if (positionLeft + this.board.offsetLeft >= (this.board.offsetLeft + this.board.offsetWidth) - this.ball.offsetWidth) {
            this.isWinner = true
            this.player1Score++
        }

        // Ponto player 2
        else if (positionLeft + this.board.offsetLeft <= this.board.offsetLeft) {
            this.isWinner = true
            this.player2Score++
        }

        else if (positionTop + this.board.offsetTop <= this.board.offsetTop) {
            if (this.currentBallDirection == 'UR') this.currentBallDirection = 'DR'
            else if (this.currentBallDirection == 'UL') this.currentBallDirection = 'DL'
        }

        else if (positionTop + this.board.offsetTop >= (this.board.offsetTop + this.board.offsetHeight) - this.ball.offsetHeight) {
            if (this.currentBallDirection == 'DR') this.currentBallDirection = 'UR'
            else if (this.currentBallDirection == 'DL') this.currentBallDirection = 'UL'
        }
    }

    VerifyBallAndBarColision(positionLeft) {
        const topBallPosition = this.ball.offsetTop + this.board.offsetTop
        const topPlayer2Position = this.player2.offsetTop + this.board.offsetTop - 12
        const topPlayer1Position = this.player1.offsetTop + this.board.offsetTop - 12

        if(positionLeft + this.ball.offsetWidth >= this.player2.offsetLeft) {
            if(topBallPosition >= topPlayer2Position && topBallPosition + this.ball.offsetHeight <= topPlayer2Position + this.player2.offsetHeight + 12) {
                if (this.currentBallDirection == 'DR') this.currentBallDirection = 'DL'
                else if (this.currentBallDirection == 'UR') this.currentBallDirection = 'UL'
            }
        }

        if(positionLeft <= this.player1.offsetLeft + this.player1.offsetWidth) {
            if(topBallPosition >= topPlayer1Position && topBallPosition + this.ball.offsetHeight <= topPlayer1Position + this.player1.offsetHeight + 12) {
                if (this.currentBallDirection == 'DL') this.currentBallDirection = 'DR'
                else if (this.currentBallDirection == 'UL') this.currentBallDirection = 'UR'
            }
        }
    }
 
    UpdateBallPosition(topDirection, leftDirection) {
        const currentTopPosition = this.ball.offsetTop
        const currentLeftPosition = this.ball.offsetLeft

        const newTopPosition = currentTopPosition + (this.ballSpeed * topDirection)
        const newLeftPosition = currentLeftPosition + (this.ballSpeed * leftDirection)
        
        this.ball.style.top = newTopPosition + 'px'
        this.ball.style.left = newLeftPosition + 'px'

        this.VerifyBallAndBarColision(newLeftPosition)
        this.VerifyBallAndBoardColision(newTopPosition, newLeftPosition)
    }

    MoveBall() {
        switch(this.currentBallDirection) {
            case 'DL':
                this.UpdateBallPosition(1, -1)
                break
            
            case 'DR':
                this.UpdateBallPosition(1, 1)
                break

            case 'UL':
                this.UpdateBallPosition(-1, -1)
                break
            
            case 'UR':
                this.UpdateBallPosition(-1, 1)
                break
            
            default:
                break
        }
    }

    #MovePlayer(player, direction) {
        const currentPosition = player.offsetTop;
        let correctTopPosition = player.offsetTop + this.board.offsetTop
        let correctBottomPosition = correctTopPosition + player.offsetHeight

        if(direction < 0 && !(correctTopPosition - this.speed <= this.board.offsetTop)) {
            const newPosition = currentPosition + (this.speed * direction)
            player.style.top = newPosition + 'px'

        } 
        else if (direction > 0 && !(correctBottomPosition + this.speed >= this.board.offsetTop + this.board.offsetHeight)){
            const newPosition = currentPosition + (this.speed * direction)
            player.style.top = newPosition + 'px'
        }
    }

    VerifyKey(keyCode) {
        switch (keyCode) {
            case 'KeyW':
                this.#MovePlayer(this.player1, -1)
                break
        
            case 'KeyS':
                this.#MovePlayer(this.player1, 1)
                break

            case 'ArrowUp':
                this.#MovePlayer(this.player2, -1)
                break

            case 'ArrowDown':
                this.#MovePlayer(this.player2, 1)
            
            default:
                break
        }
    }    
}

window.onload = () => {
    const game = new Game()
    game.InitializeEntities()
    game.GetInitialDirection()

    const interval = setInterval(() => {
        game.MoveBall()
        game.UpdateScore()

        if(game.isWinner) {
            game.isWinner = false
            game.GetInitialDirection()
            game.ResetBallPosition()
        }

    }, game.timeToUpdate)

    document.addEventListener('keydown', e => {
        game.VerifyKey(e.code)
    })
}