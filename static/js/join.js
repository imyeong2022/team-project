function Validation() {
    var RegExp = /^[a-zA-Z0-9]{4,12}$/; // 아이디 유효성 검사
    var pwExp = /[`~!@#$%^&*(),<.>/?]+[a-zA-Z0-9]{4,12}$/; // 비밀번호 유효성검사
    var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/; // 이메일 유효성 검사
    var nameExp = /^[가-힣]{2,4}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/; // 이름 유효성 검사

    var userId = "{{user_id}}"


    // 아이디 값이 없을 경우

    if (userId.value == "") {
        alert("ID를 입력해주세요.");
        console.log("아 좀 떠라");
        return false
    }

    if (!userId.value == "") {
        alert("ID를 입력해주세요.");
        console.log("아 좀 떠라2");
        return false
    }

    // 아이디가 4~12자리 영문대소문자와 숫자로만 입력되게

    if (!RegExp.test(a.value)) {
        alert("4~12자리 영문대소문자와 숫자로만 입력해주세요");
        return false;
    }

    // 비밀번호가 4~12자리로 특수문자 입력 << 왜 여기로만 넘어가고 만족해도 안넘어가지?

    if (!pwExp.test(userPw.value)) {
        alert("특수문자를 포함한 4~12자리 영문대소문자와 숫자로만 입력해주세요");
        return false;
    }

    //password_check가 입력되지 않을 경우

    if (userPc.value == "") {
        alert("passwordCheck가 입력되지 않았습니다.");
        return false;
    }

    //password_check가 입력되지 않을 경우

    if (userPc.value == userPw.value) {
        alert("비밀번호 확인값이 다릅니다.");
        return false;
    }
}