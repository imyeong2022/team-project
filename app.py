from flask import Flask, redirect, url_for, render_template, request
from flask import request, session
import pymysql

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('Board/index.html')

@app.route('/login_form_get')
def login_form_get():
    return render_template('login/login.html')

@app.route('/recent_inquiry_company')
def recent_inquiry_company():
    return render_template('login/r-i-c.html')
    
@app.route('/condition')
def condition():
    return render_template('Board/Condition.html')

@app.route('/faq')
def faq():
    return render_template('Board/faq.html')

@app.route('/company')
def company():
    return render_template('Board/company.html')

@app.route('/chart')
def chart():
    return render_template('Board/chart.html')
   
@app.route('/bar')
def bar():
    return render_template('Board/bar.html')
    
@app.route('/join')
def join():
    return render_template('login/join.html')

@app.route('/login_proc', methods=['POST'])
def login_proc():

    if request.method == 'POST': #request객체 안에 method 기능있음(자바도 마찬가지).
        user_id = request.form['user_id'] #키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_pw = request.form['user_pw']
        if len(user_id) == 0 or len(user_pw) == 0:
            return 'Error!! UserId or UserPw not found(null)'
        else:
            con = pymysql.connect(host='localhost',
                             user='root',
                             password='java',
                             db='final_test',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
            cursor = con.cursor()
            sql = 'SELECT userID, userPw, userEmail from member where userID =  %s '
            cursor.execute(sql, (user_id, ))
            row = cursor.fetchone()
            print(row) # row키확인해보자 딕셔너리로 넣어주기로한걸 볼 수 있다.
            if row:
                if user_pw == row['userPw']:
                 session['logFlag'] = True
                 session['userId'] = user_id
                 session['userEmail'] = row['userEmail']
                 #return redirect(url_for('main'))
                 return render_template('login/session_view.html')
                else:
                 return ('password is def')
            else:
                return ('id not found')

    return render_template('login/session_view.html')

app.secret_key = 'test_secret_key'
    
if __name__ == '__main__':
    #app.run('127.0.0.1', 5000, debug=True)
    app.run(debug=True)