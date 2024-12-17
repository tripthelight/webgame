/**
 * CHECK COUNTRY CODE
 */
const checkCountryCode = () => {
  let type = navigator.appName;
  let lang, country_code;
  if (type == "Netscape") lang = navigator.language;
  else lang = navigator.userLanguage;
  country_code = lang.substr(3, 4);
  return country_code;
};

const language = (country) => {
  switch (country) {
    case "KR":
      return {
        err: "잘못된 접근입니다.",
        nickInput: "닉네임을 입력하세요.",
        nickOkFront: "닉네임이",
        nickOkBack: "로 변경되었습니다.",
        nickErr0: "1글자 이상 입력해 주세요.",
        nickErr20: "20글자 이내로 입력해 주세요.",
        nickBlank: "공백없이 입력해 주세요.",
        adblock: "광고로 먹고 사는 개발자입니다.😭광고차단을 잠시 멈춰주세요.🙏",
        orderStart: "당신이 선입니다.",
        orderEnd: "상대방이 선입니다.",
        orderTie: "같은 숫자입니다. 다시 선택해주세요.",
        leaveRoom: "상대방이 방을 나갔습니다.",
        networkSpeed: "네트워크가 느려서 게임을 할 수 없습니다.",
        popup: {
          btnClose: "팝업 닫기",
        },
        balckandwhite1: {
          info: "숫자를 섞어주세요🔀",
          start: "당신이 선입니다.",
          moveNum: "숫자를 여기로 옮겨주세요.",
          order: "차례입니다.",
          wait: "기다려주세요.",
          yourTurn: "당신 차례입니다.",
        },
        indianpocker: {
          basicBet: "1코인을 기본 배팅해 주세요.",
          choiceFirst: "선플레이어를 결정하기 위해, 카드를 선택해주세요.",
          touchInfo: "카드를 터치해서, 뒤집어 주세요.",
          penalty: "내 카드가 10일 때, 내가 포기하면, 나는 다른 사람에게 10개의 칩을 줘야 합니다.",
          benefit: "상대방이 10카드로 포기했습니다. 10개의 칩을 받으세요.",
        },
        findsamepicture: {
          wait: "상대방 차례입니다. 기다려주세요.",
          touch: "알파벳을 터치해서, 프로필 아이콘 왼쪽에 있는 그림을 찾아주세요.",
        },
      };
    case "JP":
      return {
        err: "間違ったアプローチです。",
        nickInput: "ニックネームを入力してください。",
        nickOkFront: "ニックネームが",
        nickOkBack: "に変更されました。",
        nickErr0: "1文字以上入力してください。",
        nickErr20: "20文字以内で入力してください。",
        nickBlank: "スペースなしで入力してください。",
        adblock: "私は広告で生計を立てている開発者です。😭広告の遮断をしばらく止めてください。🙏",
        orderStart: "あなたが最初です。",
        orderEnd: "相手が先です。",
        orderTie: "同じ番号です。再度選択してください。",
        leaveRoom: "相手が部屋を出ました。",
        networkSpeed: "ネットワークが遅い。ゲームを進めることはできません。",
        popup: {
          btnClose: "ポップアップを閉じる",
        },
        balckandwhite1: {
          info: "数字を混ぜてください🔀",
          start: "あなたが最初です。",
          moveNum: "ここに数字を移動してください。",
          order: "最初に来ます。",
          wait: "お待ちください。",
          yourTurn: "あなたの番です。",
        },
        indianpocker: {
          basicBet: "1コインの基本ベットをしてください。",
          choiceFirst: "カードを選択して、サンプレーンを確認します。",
          touchInfo: "カードをタッチして、裏返してください。",
          penalty: "私のカードが10のとき、私があきらめた場合、私は他の人に10個のチップを与える必要があります。",
          benefit: "相手が10カードで諦めました。 10個のチップを入手してください。",
        },
        findsamepicture: {
          wait: "相手の番です。ちょっと待ってください。",
          touch: "アルファベットをタップして、プロフィール アイコンの左側にある画像を見つけます。",
        },
      };
    case "CN":
      return {
        err: "错误的做法。",
        nickInput: "请输入您的昵称。",
        nickOkFront: "昵称更改为",
        nickOkBack: "。",
        nickErr0: "请输入至少 1 个字符。",
        nickErr20: "请输入 20 个字符以内。",
        nickBlank: "请输入无空格。",
        adblock: "我是靠广告生存的开发者。😭请暂时停止广告屏蔽。🙏",
        orderStart: "你是第一个。",
        orderEnd: "对手先行。",
        orderTie: "这是同一个数字。请重新选择。",
        leaveRoom: "对方已经离开了房间。",
        networkSpeed: "网络很慢。游戏无法继续。",
        popup: {
          btnClose: "关闭弹出窗口",
        },
        balckandwhite1: {
          info: "请把这些数字混在一起🔀",
          start: "你是第一个。",
          moveNum: "请把号码移到这里。",
          order: "先来。",
          wait: "请稍等。",
          yourTurn: "該您了。",
        },
        indianpocker: {
          basicBet: "请基本下注 1 个硬币。",
          choiceFirst: "为了决定第一个玩家，请选择卡片。",
          touchInfo: "触摸卡片并将其翻过来。",
          penalty: "当我的牌是10时，如果我放弃，我必须把10个筹码给别人。",
          benefit: "你的对手放弃了 10 张牌。获得10个筹码。",
        },
        findsamepicture: {
          wait: "轮到你的对手了。请稍等。",
          touch: "触摸字母并找到位于个人资料图标左侧的图片。",
        },
      };
    case "IN": // 인도(힌디)
      return {
        err: "गलत दृष्टिकोण।",
        nickInput: "कृपया एक निकनाम दर्ज करें",
        nickOkFront: "उपनाम बदलकर",
        nickOkBack: "हो गया।",
        nickErr0: "कृपया कम से कम 1 वर्ण दर्ज करें।",
        nickErr20: "कृपया 20 वर्णों के भीतर दर्ज करें।",
        nickBlank: "कृपया बिना रिक्त स्थान के प्रवेश करें।",
        adblock: "मैं एक विकासकर्ता हूँ जो विज्ञापन पर रहता हूँ।😭कृपया एक पल के लिए विज्ञापन को अवरुद्ध करना बंद करें।🙏",
        orderStart: "आप पहले हैं।",
        orderEnd: "विरोधी पहले आता है।",
        orderTie: "वही नंबर है। कृपया फिर से चुनें।",
        leaveRoom: "दूसरे पक्ष ने कमरा छोड़ दिया है।",
        networkSpeed: "नेटवर्क धीमा है। खेल जारी नहीं रह सकता।",
        popup: {
          btnClose: "पॉपअप बंद करें",
        },
        balckandwhite1: {
          info: "कृपया संख्याएँ मिलाएँ🔀",
          start: "आप पहले है।",
          moveNum: "कृपया संख्याएँ यहाँ ले जाएँ।",
          order: "पहले आता है।",
          wait: "कृपया प्रतीक्षा करें।",
          yourTurn: "तुम्हारी बारी है.",
        },
        indianpocker: {
          basicBet: "कृपया 1 सिक्के की मूल शर्त लगाएं।",
          choiceFirst: "पहले खिलाड़ी का निर्धारण करने के लिए, कृपया एक कार्ड चुनें।",
          touchInfo: "कार्ड को स्पर्श करें और इसे पलट दें।",
          penalty: "जब मेरा कार्ड 10 है, अगर मैं हार जाता हूँ, तो मुझे 10 चिप्स किसी और को देने होंगे।",
          benefit: "आपके प्रतिद्वंद्वी ने 10 कार्डों के साथ हार मान ली। 10 चिप्स प्राप्त करें।",
        },
        findsamepicture: {
          wait: "अब आपके विरोधी की बारी है। कृपया एक पल के लिए प्रतीक्षा करें।",
          touch: "वर्णमाला को स्पर्श करें और प्रोफ़ाइल आइकन के बाईं ओर स्थित चित्र ढूंढें।",
        },
      };
    case "ID": // 인도네시아
      return {
        err: "pendekatan yang salah.",
        nickInput: "Silakan masukkan nama panggilan Anda.",
        nickOkFront: "Nickname akan diubah menjadi",
        nickOkBack: ".",
        nickErr0: "Harap masukkan minimal 1 karakter.",
        nickErr20: "Harap masukkan dalam 20 karakter.",
        nickBlank: "Silakan masukkan tanpa spasi.",
        adblock: "Aku seorang pengembang yang tinggal di periklanan.😭Tolong berhenti memblokir iklan sebentar.🙏",
        orderStart: "Kamu yang pertama.",
        orderEnd: "Lawan datang lebih dulu.",
        orderTie: "Itu nomor yang sama. Pilih lagi.",
        leaveRoom: "Pihak lain telah meninggalkan ruangan.",
        networkSpeed: "Jaringan lambat. Tidak dapat melanjutkan permainan.",
        popup: {
          btnClose: "tutup munculan",
        },
        balckandwhite1: {
          info: "Silakan campur angka🔀",
          start: "Kamu yang pertama.",
          moveNum: "Tolong pindahkan nomornya ke sini.",
          order: "datang lebih dulu.",
          wait: "Mohon tunggu.",
          yourTurn: "Sekarang giliranmu.",
        },
        indianpocker: {
          basicBet: "Harap buat taruhan dasar 1 koin.",
          choiceFirst: "Untuk menentukan pemain pertama, silahkan pilih kartu.",
          touchInfo: "Sentuh kartu dan balikkan.",
          penalty: "Ketika kartu saya 10, jika saya menyerah, saya harus memberikan 10 chip kepada orang lain.",
          benefit: "Lawan Anda menyerah dengan 10 kartu. Dapatkan 10 chip.",
        },
        findsamepicture: {
          wait: "Sekarang giliran lawan Anda. Harap tunggu sebentar.",
          touch: "Sentuh alfabet dan temukan gambar yang terletak di sebelah kiri ikon profil.",
        },
      };
    case "FR": // 프랑스
      return {
        err: "La mauvaise approche.",
        nickInput: "S'il vous plait, entrez ton surnom.",
        nickOkFront: "Surnom changé en asdfasdf",
        nickOkBack: ".",
        nickErr0: "Veuillez entrer au moins 1 caractère.",
        nickErr20: "Veuillez entrer moins de 20 caractères.",
        nickBlank: "Veuillez entrer sans espaces.",
        adblock: "Je mange de la publicité.😭Arrêtez de bloquer la publicité un moment.🙏",
        orderStart: "Tu es premier.",
        orderEnd: "L'adversaire vient en premier.",
        orderTie: "C'est le même numéro. Veuillez sélectionner à nouveau.",
        leaveRoom: "L'autre partie a quitté la salle.",
        networkSpeed: "Le réseau est lent. Le jeu ne peut pas continuer.",
        popup: {
          btnClose: "fermer la fenêtre contextuelle",
        },
        balckandwhite1: {
          info: "S'il vous plaît, mélangez les chiffres.🔀",
          start: "Tu es premier.",
          moveNum: "Veuillez déplacer les chiffres ici.",
          order: "vient en premier.",
          wait: "S'il vous plaît, attendez.",
          yourTurn: "C'est ton tour.",
        },
        indianpocker: {
          basicBet: "Veuillez faire un pari de base de 1 pièce.",
          choiceFirst: "Pour déterminer le premier joueur, veuillez sélectionner une carte.",
          touchInfo: "Touchez la carte et retournez-la.",
          penalty: "Quand ma carte est de 10, si j'abandonne, je dois donner 10 jetons à quelqu'un d'autre.",
          benefit: "Votre adversaire a abandonné avec 10 cartes. Obtenez 10 jetons.",
        },
        findsamepicture: {
          wait: "C'est au tour de votre adversaire. Veuillez patienter un instant.",
          touch: "Kosketa aakkosia ja etsi profiilikuvakkeen vasemmalla puolella oleva kuva.",
        },
      };
    case "PT": // 포루투칼
      return {
        err: "A abordagem errada.",
        nickInput: "Por favor entre o seu apodo.",
        nickOkFront: "Denominação alterada para",
        nickOkBack: ".",
        nickErr0: "Por favor entre pelo menos 1 caracteres.",
        nickErr20: "Por favor entre dentro de 20 caracteres.",
        nickBlank: "Por favor, digite sem espaços.",
        adblock: "Eu sou um desenvolvente que vive com publicidade.😭Por favor pare de bloquear o anúncio por um momento.🙏",
        orderStart: "Você é o primeiro.",
        orderEnd: "Oponente vem primeiro.",
        orderTie: "É o mesmo número. Selecione novamente.",
        leaveRoom: "A outra parte saiu da sala.",
        networkSpeed: "A rede está lenta. O jogo não pode continuar.",
        popup: {
          btnClose: "fechar pop-up",
        },
        balckandwhite1: {
          info: "Misturar os números 🔀",
          start: "Você é o primeiro.",
          moveNum: "Por favor, mude os números aqui.",
          order: "é o primeiro.",
          wait: "Por favor espere.",
          yourTurn: "É seu turno.",
        },
        indianpocker: {
          basicBet: "Por favor, faça uma aposta básica de 1 moeda.",
          choiceFirst: "Para determinar o primeiro jogador, selecione uma carta.",
          touchInfo: "Toque no cartão e vire-o.",
          penalty: "Quando meu cartão é 10, se eu desistir, tenho que dar 10 fichas para outra pessoa.",
          benefit: "Seu oponente desistiu com 10 cartas. Ganhe 10 fichas.",
        },
        findsamepicture: {
          wait: "É a vez do seu oponente. Por favor aguarde um momento.",
          touch: "Toque no alfabeto e encontre a imagem localizada à esquerda do ícone do perfil.",
        },
      };
    case "TH": // 태국
      return {
        err: "วิธีการที่ไม่ถูกต้อง.",
        nickInput: "กรุณากรอกชื่อเล่นของคุณ",
        nickOkFront: "ชื่อเล่นเปลี่ยนเป็น ",
        nickOkBack: ".",
        nickErr0: "โปรดป้อนอย่างน้อย 1 ตัวอักษร",
        nickErr20: "โปรดป้อนภายใน 20 ตัวอักษร",
        nickBlank: "กรุณากรอกโดยไม่เว้นวรรค",
        adblock: "ผมเป็นนักพัฒนาที่อาศัยอยู่บนโฆษณา😭 โปรดหยุดบล็อกโฆษณาสักครู่🙏",
        orderStart: "คุณเป็นคนแรก",
        orderEnd: "ฝ่ายตรงข้ามมาก่อน",
        orderTie: "เป็นเลขเดียวกัน กรุณาเลือกอีกครั้ง",
        leaveRoom: "อีกฝ่ายออกจากห้องไปแล้ว",
        networkSpeed: "เกมไม่สามารถดำเนินการต่อได้เนื่องจากเครือข่ายช้า",
        popup: {
          btnClose: "ปิดป๊อปอัป",
        },
        balckandwhite1: {
          info: "กรุณาผสมตัวเลข🔀",
          start: "คุณเป็นคนแรก",
          moveNum: "กรุณาย้ายตัวเลขมาที่นี่",
          order: "ต้องมาก่อน",
          wait: "กรุณารอสักครู่",
          yourTurn: "ตาคุณแล้ว",
        },
        indianpocker: {
          basicBet: "กรุณาวางเดิมพันพื้นฐาน 1 เหรียญ",
          choiceFirst: "เพื่อกำหนดผู้เล่นคนแรก โปรดเลือกการ์ด",
          touchInfo: "แตะการ์ดแล้วพลิกกลับ",
          penalty: "เมื่อไพ่ของฉันเป็น 10 ถ้าฉันยอมแพ้ ฉันต้องให้คนอื่น 10 ชิป",
          benefit: "คู่ต่อสู้ของคุณยอมแพ้ด้วยไพ่ 10 ใบ รับ 10 ชิป",
        },
        findsamepicture: {
          wait: "ถึงตาคู่ต่อสู้ของคุณแล้ว โปรดรอสักครู่",
          touch: "แตะตัวอักษรและค้นหาภาพที่ด้านซ้ายของไอคอนโปรไฟล์",
        },
      };
    case "DE": // 독일
      return {
        err: "Der falsche Ansatz.",
        nickInput: "Bitte geben Sie Ihren Nickname ein.",
        nickOkFront: "Nickname wurde in ",
        nickOkBack: "geändert.",
        nickErr0: "Bitte geben Sie mindestens 1 Zeichen ein.",
        nickErr20: "Bitte geben Sie innerhalb von 20 Zeichen ein.",
        nickBlank: "Bitte ohne Leerzeichen eingeben.",
        adblock: "Ich bin ein Entwickler, der auf Werbung lebt.😭 Bitte stoppen Sie die Werbung für einen Moment zu blockieren.🙏",
        orderStart: "Du bist der erste.",
        orderEnd: "Der Gegner kommt zuerst.",
        orderTie: "Es ist dieselbe Nummer. Bitte erneut auswählen.",
        leaveRoom: "Der Gesprächspartner hat den Raum verlassen.",
        networkSpeed: "Netzwerk ist langsam. Kann mit dem Spiel nicht fortfahren.",
        popup: {
          btnClose: "Popup schließen",
        },
        balckandwhite1: {
          info: "Bitte vermischen Sie die Zahlen 🔀",
          start: "Sie sind die Ersten.",
          moveNum: "Bitte verschieben Sie die Zahlen hier.",
          order: "kommt zuerst.",
          wait: "Bitte warten Sie.",
          yourTurn: "Es ist Ihre Zeit.",
        },
        indianpocker: {
          basicBet: "Bitte machen Sie einen Basiseinsatz von 1 Münze.",
          choiceFirst: "Um den ersten Spieler zu bestimmen, wählen Sie bitte eine Karte aus.",
          touchInfo: "Berühre die Karte und drehe sie um.",
          penalty: "Wenn meine Karte 10 ist und ich aufgebe, muss ich 10 Chips an jemand anderen geben.",
          benefit: "Dein Gegner hat mit 10 Karten aufgegeben. Holen Sie sich 10 Chips.",
        },
        findsamepicture: {
          wait: "Dein Gegner ist an der Reihe. Bitte warten Sie einen Moment.",
          touch: "Tippen Sie auf das Alphabet und suchen Sie das Bild links neben dem Profilsymbol.",
        },
      };
    case "IT": // 이탈리아
      return {
        err: "L'approccio sbagliato.",
        nickInput: "Scriva il suo apodo.",
        nickOkFront: "Il nickname è cambiato in",
        nickOkBack: ".",
        nickErr0: "Inserisca almeno un carattere.",
        nickErr20: "Scriva entro 20 caratteri.",
        nickBlank: "Si prega di inserire senza spazi.",
        adblock: "Sono un promotore che vive sulla pubblicità.😭Per favore smetta di bloccare la pubblicità per un attimo.🙏",
        orderStart: "Sei il primo.",
        orderEnd: "L'avversario viene prima.",
        orderTie: "È lo stesso numero. Seleziona di nuovo.",
        leaveRoom: "L'altra parte ha lasciato la stanza.",
        networkSpeed: "La rete è lenta. Impossibile procedere con il gioco.",
        popup: {
          btnClose: "chiudi popup",
        },
        balckandwhite1: {
          info: "Miscelare i numeri 🔀",
          start: "Lei è il primo.",
          moveNum: "Vi prego di spostare i numeri.",
          order: "viene prima.",
          wait: "Vi prego di aspettare.",
          yourTurn: "E' il suo turno.",
        },
        indianpocker: {
          basicBet: "Si prega di effettuare una puntata base di 1 gettone.",
          choiceFirst: "Per determinare il primo giocatore, seleziona una carta.",
          touchInfo: "Tocca la carta e girala.",
          penalty: "Quando la mia carta è 10, se rinuncio, devo dare 10 gettoni a qualcun altro.",
          benefit: "Il tuo avversario si è arreso con 10 carte. Ottieni 10 gettoni.",
        },
        findsamepicture: {
          wait: "È il turno del tuo avversario. Per favore aspetta un momento.",
          touch: "Tocca l'alfabeto e trova l'immagine a sinistra dell'icona del profilo.",
        },
      };
    case "ES": // 스페인
      return {
        err: "El enfoque equivocado.",
        nickInput: "Por favor, entre su apodo.",
        nickOkFront: "El apodo cambió a ",
        nickOkBack: ".",
        nickErr0: "Por favor, entre al menos 1 personaje.",
        nickErr20: "Por favor entre dentro de 20 caracteres.",
        nickBlank: "Por favor ingrese sin espacios.",
        adblock: "Soy un desarrollador que vive en publicidad.😭Por favor, deja de bloquear el anuncio por un momento.🙏",
        orderStart: "Es mi turno.",
        orderEnd: "El oponente es lo primero.",
        orderTie: "Es el mismo número. Seleccione de nuevo.",
        leaveRoom: "La otra parte ha salido de la habitación.",
        networkSpeed: "La red es lenta. No se puede continuar con el juego.",
        popup: {
          btnClose: "cerrar elemento emergente",
        },
        balckandwhite1: {
          info: "Mezclen los números 🔀",
          start: "Tú eres el primero.",
          moveNum: "Por favor muevan los números aquí.",
          order: "viene primero.",
          wait: "Por favor, espere.",
          yourTurn: "Es tu turno.",
        },
        indianpocker: {
          basicBet: "Haga una apuesta básica de 1 moneda.",
          choiceFirst: "Para determinar el primer jugador, seleccione una tarjeta.",
          touchInfo: "Toca la carta y dale la vuelta.",
          penalty: "Cuando mi tarjeta es 10, si me rindo, tengo que darle 10 fichas a otra persona.",
          benefit: "Tu oponente se rindió con 10 cartas. Consigue 10 fichas.",
        },
        findsamepicture: {
          wait: "Es el turno de tu oponente. Espere un momento por favor.",
          touch: "Toque el alfabeto y busque la imagen ubicada a la izquierda del ícono de perfil.",
        },
      };
    case "RU": // 러시아
      return {
        err: "Неправильный подход.",
        nickInput: "Пожалуйста, введите свое прозвище.",
        nickOkFront: "Ник изменился на ",
        nickOkBack: ".",
        nickErr0: "Пожалуйста, введите как минимум 1 символ.",
        nickErr20: "Пожалуйста, введите в течение 20 символов.",
        nickBlank: "Пожалуйста, введите без пробелов.",
        adblock: "Я разработчик, который живет на рекламе.😭Пожалуйста, прекратите блокировать рекламу на мгновение.🙏",
        orderStart: "Моя очередь.",
        orderEnd: "Противник на первом месте.",
        orderTie: "Это тот же номер. Выберите еще раз.",
        leaveRoom: "Другая сторона вышла из комнаты.",
        networkSpeed: "Сеть медленная. Не могу продолжить игру.",
        popup: {
          btnClose: "закрыть всплывающее окно",
        },
        balckandwhite1: {
          info: "Пожалуйста, смешивайте цифры 🔀",
          start: "Ты первый.",
          moveNum: "Пожалуйста, переместите номера здесь.",
          order: "приходит первым.",
          wait: "Пожалуйста, подождите.",
          yourTurn: "Это ваша очередь.",
        },
        indianpocker: {
          basicBet: "Пожалуйста, сделайте базовую ставку в 1 монету.",
          choiceFirst: "Чтобы определить первого игрока, выберите карту.",
          touchInfo: "Коснитесь карты и переверните ее.",
          penalty: "Когда моя карта равна 10, если я сдаюсь, я должен отдать 10 фишек кому-то другому.",
          benefit: "Ваш оппонент сдался с 10 картами. Получите 10 фишек.",
        },
        findsamepicture: {
          wait: "Настала очередь вашего противника. Пожалуйста, подождите секунду.",
          touch: "Коснитесь алфавита и найдите изображение, расположенное слева от значка профиля.",
        },
      };
    case "VN": // 베트남
      return {
        err: "Sai hướng rồi.",
        nickInput: "Xin vui lòng nhập nickname của bạn.",
        nickOkFront: "Biệt danh đã đổi thành ",
        nickOkBack: ".",
        nickErr0: "Hãy nhập ít nhất một ký tự.",
        nickErr20: "Vui lòng nhập trong vòng 20 ký tự.",
        nickBlank: "Vui lòng nhập không có dấu cách.",
        adblock: "Tôi là một nhà phát triển sống nhờ quảng cáo.😭Xin vui lòng dừng chặn quảng cáo một chút.🙏",
        orderStart: "Моя очередь.",
        orderEnd: "Противник на первом месте.",
        orderTie: "Это тот же номер. Выберите еще раз.",
        leaveRoom: "Bên kia đã rời khỏi phòng.",
        networkSpeed: "Mạng chậm. Không thể tiếp tục trò chơi.",
        popup: {
          btnClose: "đóng quảng cáo",
        },
        balckandwhite1: {
          info: "Xin hãy trộn các con số 🔀",
          start: "Anh là người đầu tiên.",
          moveNum: "Hãy di chuyển các con số đến đây.",
          order: "được ưu tiên.",
          wait: "Chờ chút nhé.",
          yourTurn: "Đến lượt anh.",
        },
        indianpocker: {
          basicBet: "Vui lòng đặt cược cơ bản là 1 xu.",
          choiceFirst: "Để xác định người chơi đầu tiên, vui lòng chọn một thẻ.",
          touchInfo: "Chạm vào thẻ và lật nó lại.",
          penalty: "Khi thẻ của tôi là 10, nếu tôi bỏ cuộc, tôi phải đưa 10 chip cho người khác.",
          benefit: "Đối thủ của bạn đã bỏ cuộc với 10 thẻ. Nhận 10 chip.",
        },
        findsamepicture: {
          wait: "Đến lượt đối thủ của bạn. Vui lòng đợi trong giây lát.",
          touch: "Chạm vào bảng chữ cái và tìm ảnh nằm ở bên trái của biểu tượng hồ sơ.",
        },
      };
    default:
      return {
        err: "The wrong approach.",
        nickInput: "Please enter your nickname.",
        nickOkFront: "Nickname changed to",
        nickOkBack: ".",
        nickErr0: "Please enter at least 1 character.",
        nickErr20: "Please enter within 20 characters.",
        nickBlank: "Please enter without spaces.",
        adblock: "I'm a developer who lives on advertising.😭Please stop blocking the advertisement for a moment.🙏",
        orderStart: "You are first.",
        orderEnd: "Opponent comes first.",
        orderTie: "It's the same number. Please select again.",
        leaveRoom: "The other party has left the room.",
        networkSpeed: "I can't play the game because my network is slow.",
        popup: {
          btnClose: "Close popup",
        },
        balckandwhite1: {
          info: "Please mix the numbers🔀",
          start: "You are first.",
          moveNum: "Please move the numbers here.",
          order: "comes first.",
          wait: "Please wait.",
          yourTurn: "It's your turn.",
        },
        indianpocker: {
          basicBet: "Please make a basic bet of 1 coin.",
          choiceFirst: "To determine the sunplane, please select a card.",
          touchInfo: "Touch the card and turn it over.",
          penalty: "When my card is 10, if I give up, I have to give 10 chips to the other person.",
          benefit: "Your opponent gave up with 10 cards. Get 10 chips.",
        },
        findsamepicture: {
          wait: "It's your opponent's turn. Please wait for a moment.",
          touch: "Touch the alphabet and find the picture located to the left of the profile icon.",
        },
      };
  }
};

const text = language(checkCountryCode());

const comnLanguage = () => {
  return {
    win: "YOU WIN",
    die: "YOU LOSE",
    drew: "WE DREW",
    betting: "BETTING",
    check: "CHECK",
    call: "CALL",
    raise: "RAISE",
    fold: "FOLD",
    allin: "ALL IN",
  };
};
const comnText = comnLanguage();

export { text, comnText };
