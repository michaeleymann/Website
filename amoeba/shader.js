let vertShader = `
	precision highp float;

	attribute vec3 aPosition;

	void main() {
		vec4 positionVec4 = vec4(aPosition, 1.0);
		positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
		gl_Position = positionVec4;
	}
`;

let fragShader = `
	precision highp float;
	
	uniform vec2 resolution;
	uniform int numbAmoebas;
	uniform vec2 amoebas[${MAX_AMOEBAS}];
	uniform int numbFood;
	uniform vec2 food[${MAX_FOOD}];
	uniform vec2 mouse;
	uniform float time;

	


	void main() {
			vec2 st = gl_FragCoord.xy / resolution.xy; 
			vec2 ms = mouse;
			st.x = st.x * resolution.x/resolution.y;
			float r = 0.0;
			float g = 0.0;
			float b = 0.0;
			float a = 1.0;

			

			for (int i = 0; i < ${MAX_AMOEBAS}; i++) {
				if (i < numbAmoebas) {
					vec2 amoebasPos = amoebas[i];
					amoebasPos.x = amoebasPos.x * resolution.x/resolution.y;
					float value = float(i) / distance(st, amoebasPos.xy) * 0.00003; 
					g += value * 0.1 * (1.0 + sin(time * 0.0004 * float(i)));
					b += value * 0.6 * (1.0 + sin(time * 0.0005 * float(i)));
					r += value * 0.3 ;				}
			}

			for (int i = 0; i < ${MAX_FOOD}; i++) {
				if (i < numbFood) {
					vec2 foodPos = food[i];
					foodPos.x = foodPos.x * resolution.x/resolution.y;
					float value = 1.0 / ( distance(st, foodPos.xy) * distance(st, foodPos.xy) )* 0.000003; 
					g += value;
					b += value;
					r += value;
				}
			}



			ms.x = ms.x * resolution.x/resolution.y;
			float value = 1.0 / distance(st.xy, ms.xy) * 0.002 * (2.0 + sin(time * 0.02));
			g += value;
			b += value;
			r += value;

			gl_FragColor = vec4(r, g, b, a);
	}
`;