import { ROUTES, API_ENDPOINTS } from '/src/utils/routes.js'
import { makeRequest } from '/src/functions/makeRequest.js'
import { TableHead, CadastrosTableRow } from '/src/components/table.js'

export function AlunoTable(rows) {
    const headerContent = [
        {
            content: 'Nome',
        },
        {
            content: 'Matricula',
            className: 'pl-4'
        },
        {
            content: 'Disciplinas',
        },
        {
            content: 'Ações',
        },
    ]
    const table = document.createElement('table')
    const thead = TableHead(headerContent)
    const tbody = document.createElement('tbody')
    table.className = 'border-separate border-spacing-table'
    rows.forEach((row) => {
        tbody.appendChild(
            CadastrosTableRow({
                id: row._id,
                matriculaOuProfessor: row.matricula,
                name: row.nome,
                type: 'aluno',
                array: row.disciplinas,
                toEdit: ROUTES.ADMIN.EDICAO.ALUNOS(row._id),
                onRemove: async () => {
                    try {
                        const accessToken = localStorage.getItem('accessToken')
                        await makeRequest( { 
                            url: API_ENDPOINTS.DELETE_USER, 
                            method:'DELETE', 
                            token: accessToken, 
                            data: { "id": row._id }
                        })
                        await makeRequest( { 
                            url: API_ENDPOINTS.DELETE_RELATION_BY_ALUNO_ID, 
                            method:'DELETE', 
                            token: accessToken, 
                            data: { "id": row._id }
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