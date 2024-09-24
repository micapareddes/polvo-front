import { API_ENDPOINTS, ROUTES } from "/src/utils/routes.js"
import { makeRequest } from '/src/functions/makeRequest.js'

import { Text } from "/src/components/fonts.js"
import { EditRemoveActionButtons } from "/src/components/edit-remove.js"
import { TableHead, TableRow } from "/src/components/table.js"
import { AlertDialog, openDialog } from '/src/components/dialog.js'
import { SuccessToaster, openToaster, closeToaster } from '/src/components/toaster.js'

export function QuizTable(quizzes) {
    const headerContent = [
        {
            content: 'Nome',
        },
        {
            content: 'Ações',
        },
    ]
    const table = document.createElement('table')
    const thead = TableHead(headerContent)
    const tbody = document.createElement('tbody')

    table.className = 'border-separate border-spacing-table'
    quizzes.forEach((quiz) => {
        tbody.appendChild(
            TableRow({
                cells: [
                    {
                        content: Text({
                            text: quiz.nome,
                            size: 'md',
                            tone: 's-900',
                        }),
                        className: 'w-auto'
                    },
                    {
                        content: EditRemoveActionButtons({
                            onEdit: ROUTES.ADMIN.EDICAO.QUIZZES(quiz.quiz_id),
                            onRemove: () => {
                                openDialog(
                                    AlertDialog({
                                        message: `Você irá remover o quiz ${quiz.nome}. Esta ação não pode ser desfeita.`, 
                                        confirmarButtonName: 'Remover', 
                                        onConfirm: async () => {
                                            try {
                                                await makeRequest({
                                                    url: API_ENDPOINTS.DELETE_QUIZ(quiz.quiz_id), 
                                                    method: 'DELETE', 
                                                    token: localStorage.getItem('accessToken'), 
                                                })
                                                openToaster(
                                                    SuccessToaster({
                                                        message: `Quiz ${quiz.nome} eliminado!`
                                                    })
                                                )
                                                closeToaster()
                                            } catch (error) {
                                                console.log(error);
                                                alert('Algo deu errado, tente novamente mais tarde...')
                                            }
                                        } 
                                    })
                                )
                            }
                        }),
                        className: 'w-1/100'
                    },
                ]
            })
        )
    })
    table.append(thead, tbody)
    return table
}