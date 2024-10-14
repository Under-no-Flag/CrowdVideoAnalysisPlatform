const base = {
	getTreePath({ data = [], id,  checkFunc, props,  isIdPaths, paths = []  }){
		props = { children: 'children', id: 'id', ...(props || {}) };
		for(const c of data){
			if( checkFunc ? checkFunc({ id,item:c,data, props, paths }) : c[ props.id ] === id ) return (paths.push(isIdPaths ? c[ props.id ] : c), paths);
			if(!c[ props.children ]) continue;
			paths.push(isIdPaths ? c[ props.id ] : c);
			const res = base.getTreePath({ data: c[ props.children ]  ,id, checkFunc, props,  isIdPaths, paths });
			if(res) return res;
			paths.pop();
		}
		return false;
	},
	params:{
		humpToSplit(s, symbol = '_'){
			s+='';
			if(!s.length) return s
			return  s[0] + s.slice(1).replace(/([A-Z])/g, txt => symbol + txt.toLowerCase() )
		},
	},
	date:{
		repairZero: s=> (s+'').length === 1 ? '0' + s : s,
		local(type,dateObj){
			dateObj = dateObj || new Date();
			const [date,time] = [
				`${dateObj.getFullYear()}-${this.repairZero(dateObj.getMonth() + 1 )}-${this.repairZero(dateObj.getDate())}`,
				`${this.repairZero(dateObj.getHours())}:${this.repairZero(dateObj.getMinutes())}:${this.repairZero(dateObj.getSeconds())}`
			]
			
			switch(type){
				case 'date': return date;
				case 'time': return time;
				default: return date + ' ' + time;
			}
		},
		format(s,date){
			date = date || new Date();
			const {repairZero} = this;
			const reg = {
				yyyy: date.getFullYear(),
				yy: (date.getFullYear()+'').slice(2),
				MM: repairZero( date.getMonth() + 1),
				dd: repairZero( date.getDate()),
				HH: repairZero( date.getHours()),
				mm: repairZero( date.getMinutes()),
				ss: repairZero( date.getSeconds()), 
			}
			Object.keys(reg).forEach(r=> s = s.replace( new RegExp(`${r}`,'g' ), reg[r] ) ) 
			return s
		},
	},
	clone(o) {
		let res;
		const type = this.isType(o);
		if (o && ['object','array'].includes(type)) {
			res = type === 'array' ? [] : {};
			for (let k of Object.keys(o)) {
				const v = o[k];
				res[k] = this.clone(v);
			}
		}
		else res = o;
		
		return res;
	},
	testFile({ files, maxSize, types }) {
		if (!files || !files.length) return 0
	
		for (const file of files) {
			if (maxSize && maxSize < file.size) return 0
			if (types && !types.includes(file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase())) return 0
		}
	
		return 1
	},
	
	clearEmpty( o , arr = [null, 'NaN', undefined, '', false]){
		const res = {};
		Object.keys(o).forEach(k=> !arr.some(n=> n === 'NaN' ?  o[k] !== o[k] :  o[k] === n ) && (res[k] = o[k]) );
		return res;
	},
	
	copyText(txt){
		const input = document.createElement('input');
		input.value = txt;
		input.style.left = '-9999px';
		input.style.position = 'fixed';
		document.body.appendChild(input)
		input.select();
		document.execCommand('copy');
		input.remove()
	},
	isType(o){
		return Object.prototype.toString.call(o).match(/\[object\s([a-zA-Z0-9]+)\]/)[1].toLowerCase();
	},
	fileTest({files, maxSize ,types}){
		if(!files || !files.length) return 0;
		
		
		for(const file of files){
			if(maxSize && maxSize < file.size) return 0;
			if(types && !types.includes(file.name.slice( file.name.lastIndexOf('.')+1 ).toLowerCase()  ) ) return 0;
		}
		
		return 1;
	},
	download(url, fileName){
		const a = document.createElement('a');
		a.href = url;
		a.target = "_blank";
		a.download = fileName || url;
		a.click();
		setTimeout(()=> a.remove(), 3000);
	},
	
	debounce:{
		data: [],
		commit(name, fun,  waitTime = 1000){
			if(!name) return;
			let target = this.data.find( v => v.name === name );
			// name必须唯一，否则会替代之前的
			if(!target){
				target = { name,   waitTime};
				this.data.push(target);
			}
			clearTimeout( target.timer);
			target.timer = setTimeout( fun, waitTime);
			
		}
	},
	

	filterRoutes(routes, menus, res = []) {
		for(let i = 0; i < routes.length; i++ ){
			const r = routes[i];
			if(r.children && r.children.length ) r.children = this.filterRoutes(r.children, menus );
			
			const tg = menus.find(c => c.route === r.path && c.status === 'ENABLE');
			if(!tg && !(r.children && r.children.length) ) continue;
			
			if(tg){
				r.order = tg.order;
				if(r.meta) r.meta.title = tg.name;
				res.push(r);
			}
			else if(r.children.length) res.push(r);
		}
		
		if(res.length > 1) res.sort( (a,b) => b.order * 1 - a.order * 1  );
		
		return res;
	},
	
	dataExportExcel( cols = [] , rows = [], fileName = '表格', spacing = 3, border) {
		let html = `<table ${border ? 'border="1"' : ''} ><tbody>`;
		
		for(const i in cols ){
			html+= `<tr>${cols[i].map(v=> `<th>${v.label}</th>` ).join('') }</tr>`
			
			html+= rows[i].map(v=> `<tr>${ cols[i].map(({prop})=> `<th>${v[prop]}</th>` ).join('') }</tr>` ).join('')
			
			html +=  new Array(spacing).fill("<tr></tr>").join('');
		}
		
		html += `</tbody></table>`;

		const blob = new Blob([html], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);
		this.download(url, fileName + '.xls' );
		URL.revokeObjectURL(url);
	},
	dataExportCsv( cols = [] , rows = [], fileName = '数据', spacing = 3) {
		let csv = "";
				
		for(const i in cols ){
			const arr = [];
			const keys = cols[i].map(v=> v.prop) ;
			arr.push( cols[i].map(v=> v.label).join(',') );
			rows[i].forEach(v=> arr.push(keys.map(k=> v[k]+'' ).join(',')) )
			arr.push( ...new Array(spacing).map(()=> keys.map(k=> '').join(',')  )  )
			csv+=arr.join('\r\n');
		}
		const blob = new Blob([csv], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);
		this.download(url, fileName + '.csv' );
		URL.revokeObjectURL(url);
	},
	
	
	
	sign:{
		create(data, key , mode = 's32'){
			const newData = {};
			Object.keys(data).sort().forEach(k=> newData[k] = data[k]);
			return this.md5[mode]( JSON.stringify(newData) + key )
		}
	},
	
	
	md5:{
		hex_md5(string,bit) {
		    function md5_RotateLeft(lValue, iShiftBits) {
		        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		    }
		    function md5_AddUnsigned(lX, lY) {
		        var lX4, lY4, lX8, lY8, lResult;
		        lX8 = (lX & 0x80000000);
		        lY8 = (lY & 0x80000000);
		        lX4 = (lX & 0x40000000);
		        lY4 = (lY & 0x40000000);
		        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		        if (lX4 & lY4) {
		            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		        }
		        if (lX4 | lY4) {
		            if (lResult & 0x40000000) {
		                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
		            } else {
		                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
		            }
		        } else {
		            return (lResult ^ lX8 ^ lY8);
		        }
		    }
		    function md5_F(x, y, z) {
		        return (x & y) | ((~x) & z);
		    }
		    function md5_G(x, y, z) {
		        return (x & z) | (y & (~z));
		    }
		    function md5_H(x, y, z) {
		        return (x ^ y ^ z);
		    }
		    function md5_I(x, y, z) {
		        return (y ^ (x | (~z)));
		    }
		    function md5_FF(a, b, c, d, x, s, ac) {
		        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
		        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		    };
		    function md5_GG(a, b, c, d, x, s, ac) {
		        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
		        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		    };
		    function md5_HH(a, b, c, d, x, s, ac) {
		        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
		        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		    };
		    function md5_II(a, b, c, d, x, s, ac) {
		        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
		        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		    };
		    function md5_ConvertToWordArray(string) {
		        var lWordCount;
		        var lMessageLength = string.length;
		        var lNumberOfWords_temp1 = lMessageLength + 8;
		        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		        var lWordArray = Array(lNumberOfWords - 1);
		        var lBytePosition = 0;
		        var lByteCount = 0;
		        while (lByteCount < lMessageLength) {
		            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		            lBytePosition = (lByteCount % 4) * 8;
		            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
		            lByteCount++;
		        }
		        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		        lBytePosition = (lByteCount % 4) * 8;
		        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		        return lWordArray;
		    };
		    function md5_WordToHex(lValue) {
		        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
		        for (lCount = 0; lCount <= 3; lCount++) {
		            lByte = (lValue >>> (lCount * 8)) & 255;
		            WordToHexValue_temp = "0" + lByte.toString(16);
		            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		        }
		        return WordToHexValue;
		    };
		    function md5_Utf8Encode(string) {
		        string = string.replace(/\r\n/g, "\n");
		        var utftext = "";
		        for (var n = 0; n < string.length; n++) {
		            var c = string.charCodeAt(n);
		            if (c < 128) {
		                utftext += String.fromCharCode(c);
		            } else if ((c > 127) && (c < 2048)) {
		                utftext += String.fromCharCode((c >> 6) | 192);
		                utftext += String.fromCharCode((c & 63) | 128);
		            } else {
		                utftext += String.fromCharCode((c >> 12) | 224);
		                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		                utftext += String.fromCharCode((c & 63) | 128);
		            }
		        }
		        return utftext;
		    };
		    var x = Array();
		    var k, AA, BB, CC, DD, a, b, c, d;
		    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
		    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
		    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
		    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
		    string = md5_Utf8Encode(string);
		    x = md5_ConvertToWordArray(string);
		    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
		    for (k = 0; k < x.length; k += 16) {
		        AA = a; BB = b; CC = c; DD = d;
		        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		        a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		        c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		        b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		        c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		        d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		        c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		        a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		        d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		        b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		        a = md5_AddUnsigned(a, AA);
		        b = md5_AddUnsigned(b, BB);
		        c = md5_AddUnsigned(c, CC);
		        d = md5_AddUnsigned(d, DD);
		    }
		    if(bit==32){
		        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
		    }
		    return (md5_WordToHex(b) + md5_WordToHex(c)).toLowerCase();
		},
		// 16位小写
		s16(s) {
			return this.hex_md5(s,16); 
		},
		//16位大写
		l16(s) { 
			return  this.hex_md5(s,16).toUpperCase(); 
		},
		//32位小写
		s32(s) { 
			return this.hex_md5(s,32); 
		},
		//32位大写
		l32(s) { 
			return this.hex_md5(s,32).toUpperCase(); 
		},
	},
	
	
};

export default base;
