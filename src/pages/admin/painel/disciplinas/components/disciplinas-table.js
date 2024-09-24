import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { TableHead, CadastrosTableRow } from '/src/components/table.js'

export function DisciplinasTable(rows) {
    const headerContent = [
        {
            content: 'Nome',
        },
        {
            content: 'Professor',
            className: 'pl-4'
        },
        {
            content: 'Quiz',
            className: 'pl-4'
        },
        {
            content: 'Ações',
            className: 'pl-4'
        },
    ]
    const table = document.createElement('table')
    const thead = TableHead(headerContent)
    const tbody = document.createElement('tbody')

    table.className = 'border-separate border-spacing-table w-full'
    tbody.className = 'w-full bg-indigo-50'

    rows.forEach((row) => {
        tbody.appendChild(
            CadastrosTableRow({
                id: row.id,
                matriculaOuProfessor: row.professor,
                name: row.name,
                type: 'disciplina',
                array: row.quizzes,
                toEdit: ROUTES.ADMIN.EDICAO.DISCIPLINAS(row.id),
                onRemove: async () => {
                    try {
                        await makeRequest( { 
                            url: API_ENDPOINTS.DELETE_DISCIPLINA, 
                            method:'DELETE', 
                            token: localStorage.getItem('accessToken'), 
                            data: { "id": row.id }
                        })
                    } catch (error) {
                        console.log(error);
                        if (error.status === 403) {
                            alert('Acesso Proibido')
                        } 
                        if (error.status === 403) {
                            alert('Ação Proibida')
                        } else {
                            alert('Algo deu errado, tente novamente mais tarde...')
                        }
                    }
                },
            })
        )
    })

    table.append(thead, tbody)

    return table
}