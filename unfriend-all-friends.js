/*
* Requirement: New Facebook 
* Please copy all the code to make sure that you will not get any errors
* BEFORE YOU RUN CODE, INSPECT ANY LIKE BUTTON YOU SEE FIRST, THEN THIS CODE WILL RUN SUCCESSFULLY
* Please switch to NEW Facebook and navigate to this link: https://www.facebook.com/me/friends
*/
// You can change the delay time or not (in milliseconds, 1 s = 1000 ms)
// REMEMBER: the longer the delay time you set, the bigger your chance of not getting Facebook Checkpoint


// Don't modify code below
(() => {
  console.log("\x1b[36m%s\x1b[0m", "Code by JayremntB, 2020");
	console.log("\x1b[36m%s\x1b[0m", "Please remember if you meet an error, just reload page, wait for 3 seconds and run the code again");
  let userIndex = 0;
  setTimeout(function continuousWhenPageLoad() {
    let users = document.getElementsByClassName('bp9cbjyn ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi n1f8r23x rq0escxv j83agx80 bi6gxh9e discj3wi hv4rvrfc ihqw7lf3 dati1w0a gfomwglr');
    if(users.length === 0 || userIndex + 8 > users.length - 1) return console.warn("You have reached the end of list friends");
    // click Friends button
    setTimeout(function clickNextFriendsButton() {
      if(userIndex + 8 > users.length - 1) {
        window.scrollTo(0, document.body.scrollHeight); // scroll to the end of page
        setTimeout(continuousWhenPageLoad, 2500);
        return;
      }
      // click Friends button
      users[userIndex].lastChild.firstChild.firstChild.firstChild.click();
      // click Unfriend button
      setTimeout(() => {
        const listButtonsWhenClickFriendsButton = document.getElementsByClassName('oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 oi9244e8 oygrvhab h676nmdw cxgpxx05 dflh9lhu sj5x9vvc scb9dxdr i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn dwo3fsh8 btwxx1t3 pfnyh3mw du4w35lb');
        listButtonsWhenClickFriendsButton[listButtonsWhenClickFriendsButton.length - 1].click();
        // click Confirm button
        return setTimeout(() => {
          document.getElementsByClassName('rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 d1544ag0 tw6a2znq s1i5eluu tv7at329')[1].click()
          const friendName = users[userIndex ++].firstChild.nextSibling.firstChild.textContent;
          console.log(`Removed ${friendName} as a friend!`);
          setTimeout(continuousWhenPageLoad, 0);
        }, 200);
      }, 1500);
    }, 0);
  }, 0);
})();