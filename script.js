$(document).ready(function() {
	var asc = true;
	var searchTerm = '';
	let data = [];
	const tBody = $('#personas tbody');
	let pageCount = 5;
	let currentPage = 1;
	let hojas = 0;

	function getData() {
		$.ajax({
			type: 'GET',
			url: './archivos.xml',
			contentType: "application/xml; charset=utf-8",
			dataType: 'xml',
			success: function (res) {
				$(res).find('persona').each(function(idx) {
					data.push({
						id: idx,
						nombre: $(this).find('nombre').text(),
						apellidos: $(this).find('apellidos').text(),
						fechaNacimiento: $(this).find('fechaNacimiento').text()
					});
				});

				hojas = Math.ceil(data.length / pageCount);

				$('span.total').text(data.length);
			}
		})
	};

	function render() {
		$('button.prev').attr('disabled', false);
		$('button.next').attr('disabled', false);

		if (currentPage <= 1) {
			$('button.prev').attr('disabled', true);
		}

		if (currentPage >= hojas) {
			$('button.next').attr('disabled', true);
		}


		tBody.empty();
		const limitElement = currentPage * pageCount;
		const initialElement = limitElement - (pageCount - 1);

		let elementsByPage = [];

		for(let i = 0; i < data.length; i ++) {
			if (
				(i + 1 === initialElement || i + 1 > initialElement) &&
				(i + 1 === limitElement || i + 1 < limitElement)
			) {
				elementsByPage.push(data[i])
			}
		}

		$('span.from').text(initialElement);
		$('span.to').text(limitElement);

		elementsByPage.sort((a,b) => {
			var x = a.nombre.toLowerCase();
	    var y = b.nombre.toLowerCase();
			if (asc) {
				return x < y ? -1 : x > y ? 1 : 0;
			} else {
				return x > y ? -1 : x < y ? 1 : 0;
			}
		}).map(function(item) {
			var fila = $('<tr>')
			fila.append($(`<td>${item.nombre}</td>`));
			fila.append($(`<td>${item.apellidos}</td>`));
			fila.append($(`<td>${item.fechaNacimiento}</td>`));
			if (searchTerm) {
				if (item.nombre.toLowerCase().includes(searchTerm)) {
					tBody.append(fila);
				}
			} else {
				tBody.append(fila);
			}
		});
	}

	getData();
	setTimeout(function() {
		render();
	}, 100)

	$('#myInput').on('keyup', function(e) {
	 	searchTerm = e.currentTarget.value;

		setTimeout(function() {
			render();
		}, 100)
	});

	$('#order').on('click', function() {
		asc = !asc;

		setTimeout(function() {
			render();
		}, 100)
	});

	$('button.prev').on('click', function() {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
			render();
		}
	});

	$('button.next').on('click', function() {
		if (currentPage < hojas) {
			currentPage = currentPage + 1;
			render();
		}
	});

});
