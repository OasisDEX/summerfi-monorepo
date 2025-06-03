export const consoleInfo = (): void => {
  // eslint-disable-next-line no-console
  console.log(
    `%c       @@@@@@@@@@@@@@@@                   
    @@@@@@@@@@@@@@@@@@@@@                 
  @@@@@@@@@@@@@@@@@@@@@@@@@               
 @@@@@@@@@@@@@@@@@@@@@@@@@@@              
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@             
@@@@@@@@@@@       @@@@@@@@@@@             
@@@@@@@@@@@        @@@@@@                 
 @@@@@@@@@@@@@@@@@                        
 @@@@@@@@@@@@@@@@@@@@@@@                  
  @@@@@@@@@@@@@@@@@@@@@@@@@               
    @@@@@@@@@@@@@@@@@@@@@@@@              
       @@@@@@@@@@@@@@@@@@@@@@             
              @@@@@@@@@@@@@@@@            
   @@@@@@@         @@@@@@@@@@@            
@@@@@@@@@@@        @@@@@@@@@@@            
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@            
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@     @@@@    
  @@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@ 
    @@@@@@@@@@@@@@@@@@@@@@    @@@@@@@@@@@@
       @@@@@@@@@@@@@@@@       @@@@@@@@@@@@ %s`,
    `font-size: 12px; background: -webkit-linear-gradient(#af47ff, #e036d8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`,
    `%c \n\n If anybody asked you to paste anything in here, please do not do it! %s\n`,
    'color: #af47ff; font-size: 14px',
    `%c \n\n Find us on discord: https://discord.com/invite/summerfi %s\n`,
    'color: #cb3dec; font-size: 14px',
    `%c \n\n Cheers ✌️`,
    'color: #e036d8; font-size: 14px',
  )
}
