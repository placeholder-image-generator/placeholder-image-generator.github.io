    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const colorPicker = document.getElementById('colorPicker');
    const textInput = document.getElementById('textInput');
    const textColor = document.getElementById('textColor');
    const textAlignInput = document.getElementById('textAlign');
    const fontStyleInput = document.getElementById('fontStyle');
    const exportBtn = document.getElementById('exportBtn');

    function randomString(length = 6) {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    exportBtn.addEventListener('click', () => {
      const w = parseInt(widthInput.value);
      const h = parseInt(heightInput.value);
      const bgColor = colorPicker.value;
      const text = textInput.value;
      const txtColor = textColor.value;
      const textAlign = textAlignInput.value;
      const fontStyle = fontStyleInput.value;

      if (!w || !h) return alert('Please enter valid width and height');

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      if (text) {
        const lines = text.split('\n');
        const padding = 50; // 50px padding on each side
        const maxWidth = w - padding * 2;
        let fontSize = 500;
        ctx.font = `${fontStyle} ${fontSize}px Helvetica, Arial, sans-serif`;

        // Decrease font size until the longest line fits within maxWidth
        while (lines.some(line => ctx.measureText(line).width > maxWidth) && fontSize > 5) {
          fontSize--;
          ctx.font = `${fontStyle} ${fontSize}px Helvetica, Arial, sans-serif`;
        }

        ctx.fillStyle = txtColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';

        const lineHeight = fontSize * 0.65;
        const totalHeight = lineHeight * lines.length;
        let startY = (h - totalHeight) / 2 + lineHeight / 2;

        let x;
        if (textAlign === 'left') x = padding;
        else if (textAlign === 'right') x = w - padding;
        else x = w / 2;

        lines.forEach((line, i) => {
          ctx.fillText(line, x, startY + i * lineHeight);
        });
      }

      const uniqueFilename = `placeholder-${randomString()}.png`;
      const link = document.createElement('a');
      link.download = uniqueFilename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });