(function(){
    document.getElementById("button").onclick = function() {

        //法定相続人の人数
        var number = document.getElementById("number").value;
        var nop;
        switch (number) {
            case '1' : nop = 1;
                break;
            case '2' : nop = 2;
                break;
            case '3' : nop = 3;
                break; 
            case '4' : nop = 4;
                break;
            case '5' : nop = 5;
                break;
            case '0' : nop = 0;
                break;
            default:
        }

        /*基礎控除額の計算*/
        //配偶者の有無
        var Spouse = document.getElementsByName("spouse");

        for(var i = 0; i < Spouse.length; i++) {
            if(Spouse[i].checked) {
                var spouse = Spouse[i].value;
            }
        }

        //基礎控除額
        var BasicDeduction;
        if(spouse ==='yes') {
            BasicDeduction = (30000000 + (6000000 * (nop + 1)));
        } else {
            BasicDeduction = (30000000 + (6000000 * nop));
        }
        console.log('基礎控除額は'+BasicDeduction+"円です");

        //法定相続割合の算出
        //変数otherに配偶者以外の相続人の続柄を入れる
        var Other = document.getElementsByName("other");
        for(var j = 0; j < Other.length ; j++) {
            if(Other[j].checked) {
                var other = Other[j].value;
            }
        }

        if(other === "other") {
            if(nop !== 0) {
                swal({
                    title: "要確認",
                    text: "配偶者を除く法定相続人は0のはずです。",  
                    type: "error",   
                    confirmButtonText: "OK"
                });
                return;
            }
        }

        //課税遺産総額
        var TotalTaxableHeritage;
        //遺産相続
        var total_heritage = document.getElementById("total_heritage").value;

        if(! total_heritage) {
            swal({
                title:"遺産総額が未入力です",
                text: "計算できません。",  
                type: "error",   
                confirmButtonText: "OK"
            });
            return;
        }

        TotalTaxableHeritage = total_heritage - BasicDeduction;
        console.log("課税遺産総額は"+TotalTaxableHeritage+'円');

        //法定相続分
        var LegalInheritance;
        if(spouse ===　'yes') {
            switch(other) {
                case 'child' : LegalInheritance = 1/2;
                    break;
                case 'parents' : LegalInheritance =  2/3;
                    break;
                case 'BandS' : LegalInheritance = 3/4;
                    break; 
                case 'other' : LegalInheritance = 1;
            }
        } else {
            LegalInheritance = 0;
        }

        //配偶者の法定相続分
        var spouseLegalInheritance;
        spouseLegalInheritance = LegalInheritance;
        console.log("配偶者の法定相続分は"+spouseLegalInheritance+'/n');
        nop = parseInt(nop,10);

        //配偶者以外の1人当たりの法定相続分
        var o_spouseLegalInheritance;
        o_spouseLegalInheritance = (1 - LegalInheritance)/nop;
        console.log("配偶者以外の1人当たりの法定相続分は"+o_spouseLegalInheritance+'/n');

        //配偶者の税額
        var taxSpouse = TotalTaxableHeritage * LegalInheritance; 
        console.log('配偶者の相続金額は'+taxSpouse+'円');

        if(10000000 >= taxSpouse) {
            var tax =  taxSpouse * 0.1;
        } else if( 10000000 <  taxSpouse &&  taxSpouse <= 30000000) {
            tax = taxSpouse * 0.15 -   500000;
        } else if( 30000000 <  taxSpouse && taxSpouse <=  50000000) {
            tax = taxSpouse * 0.2  -  2000000;
        } else if( 50000000 <  taxSpouse && taxSpouse <= 100000000) {
            tax = taxSpouse * 0.3  -  7000000;
        } else if(100000000 <  taxSpouse && taxSpouse <= 200000000) {
            tax = taxSpouse * 0.4 - 17000000;
        } else if(200000000 <  taxSpouse && taxSpouse <= 300000000) {
            tax = taxSpouse * 0.45 - 27000000;
        } else if(300000000 <  taxSpouse && taxSpouse <= 600000000) {
            tax = taxSpouse * 0.5  - 42000000;
        } else if(600000000 <  taxSpouse) {
            tax = taxSpouse * 0.55 - 72000000;
        }

        //配偶者の税額
        taxSpouse = tax;
        console.log('配偶者の相続税額は'+taxSpouse+'円');

        //配偶者以外の1人当たりの税額の計算
        var o_tax;
        o_tax = TotalTaxableHeritage * o_spouseLegalInheritance;

        if(10000000 >= o_tax) {
            tax =  o_tax * 0.1;
        } else if( 10000000 <  o_tax &&  o_tax <= 30000000) {
            tax = o_tax * 0.15 -   500000;
        } else if( 30000000 <  o_tax && o_tax <=  50000000) {
            tax = o_tax * 0.2  -  2000000;
        } else if( 50000000 <  o_tax && o_tax <= 100000000) {
            tax = o_tax * 0.3  -  7000000;
        } else if(100000000 <  o_tax && o_tax <= 200000000) {
            tax = o_tax * 0.4 - 17000000;
        } else if(200000000 <  o_tax && o_tax <= 300000000) {
            tax = o_tax * 0.45 - 27000000;
        } else if(300000000 <  o_tax && o_tax <= 600000000) {
            tax = o_tax * 0.5  - 42000000;
        } else if(600000000 <  o_tax){
            tax = o_tax * 0.55 - 72000000;
        }

        //配偶者以外の税額
        var totalOther;
        totalOther = Math.floor(tax/1000)*1000;
        console.log("配偶者以外の一人当たりの税額"+totalOther+'円');

        //相続税の総額
        var totalTax;
        totalTax = (totalOther * nop) + taxSpouse;
        console.log('配偶者も合わせて全員分合わせた税額は'+totalTax);

        //配偶者控除
        var SpousalDeduction;

        //全体の税額から配偶者の法定相続分で配偶者分の税額を算出する
        SpousalDeduction = totalTax * spouseLegalInheritance;
        SpousalDeduction = Math.floor(SpousalDeduction/1000)*1000;
        console.log('配偶者控除額は'+SpousalDeduction+'円');

        //相続税の総額額
        totalTax = taxSpouse + (totalOther * nop);
        console.log('相続税の総額(配偶者控除前)は'+totalTax+'円');

        //相続税額
        var InheritanceTaxAmount;
        InheritanceTaxAmount = totalTax - SpousalDeduction;
        console.log('相続税の総額(配偶者控除後)は'+InheritanceTaxAmount+'円');

        if(other === 'BandS') {
            InheritanceTaxAmount = InheritanceTaxAmount * 1.2;
            InheritanceTaxAmount = Math.floor(InheritanceTaxAmount/1000)*1000;
        }
        console.log("兄弟姉妹が相続人なので2割加算して"+InheritanceTaxAmount+'円');

        if(spouse === 'no' && other === 'other') {
            swal({
                title: "要確認",
                text: "計算できません。",  
                type: "error",   
                confirmButtonText: "OK"
            });
            return;
        }

        if(InheritanceTaxAmount <= 0) {
            swal({
                title: "相続税はかかりません。",
                text: "試算です。詳しくは税理士にご相談ください",  
                type: "info",   
                confirmButtonText: "OK"
            });
            return;
        }

        var anser = Math.floor(InheritanceTaxAmount/1000)*1000;
        document.getElementById("output").innerHTML = anser.toLocaleString() + "円";

        if(0 > anser) {
            return;
        }

        swal({
            title:anser.toLocaleString() + "円",
            text: "近くの税理士を調べますか？",
            type: "info",
            showCancelButton : "true",
            cancelButtonText : "いいえ",
            confirmButtonText: "調べる"
        }, function() {
            var url = "https://www.google.co.jp/search?q=近くの税理士";
            window.open(url);
        });
    };
})();
