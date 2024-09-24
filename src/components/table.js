// Components
import { openDialog, AlertDialog } from "./dialog.js"
import { openToaster, closeToaster, SuccessToaster } from "./toaster.js"
import { Text } from "./fonts.js"
import { TooltipItems } from "./tooltip-items.js"
import { EditRemoveActionButtons } from "./edit-remove.js"

export function TableRow({ cells=[{ content: 'empty', className: '' }] }) {
    const row = document.createElement('tr')
    row.className = `bg-neutral-100 shadow-sm rounded-xl`

    cells.forEach((cell) => {
        const cellTd = document.createElement('td')
        cellTd.className = `px-5 py-4 first:rounded-l-xl last:rounded-r-xl ${cell.className}`
        cellTd.appendChild(cell.content)
        row.appendChild(cellTd)
    })

    return row
}

export function CadastrosTableRow({ 
    id, type, name, matriculaOuProfessor, array=[], toEdit, onRemove  
}) {
    const successMessage = type === 'disciplina' ? `A disciplina ${name} foi removida!` : `O ${type} ${name} foi removido!`
    
    const removeDialogMessage = type === 'disciplina' ? `Você irá remover a disciplina ${name}. Esta ação não pode ser desfeita.` : `Você irá remover o ${type} ${name}. Esta ação não pode ser desfeita.`

    const sucessToaster = SuccessToaster({message: successMessage})

    const removeDialog = AlertDialog({
        message: removeDialogMessage,
        confirmarButtonName: 'Remover',
        onConfirm: async () => {
            await onRemove() 
            row.remove()
            window.location.reload()
            // TODO: Fazer lógica de countdown sem precisar do reload
            // countDown()
            // const total = totalDeDisciplinas()
            // if (total === 0) Empty({
            //     message: `Nenhum ${type} cadastrado.`
            // })
            // openToaster(sucessToaster)
            // closeToaster()
        }
    })

    const matriculaOuProfessorCol = Text({
        text: matriculaOuProfessor,
        size: 'md',
        tone: matriculaOuProfessor === 'Nenhum Professor' ? 's-400' : 's-900',
    })

    const nomeCol = Text({
        text: name,
        size: 'md',
        tone: 's-900',
    })

    const arrayCol = TooltipItems({
        items: array
    })

    const acoesCol = EditRemoveActionButtons({
        onEdit: toEdit,
        onRemove: () => openDialog(removeDialog)
    })
    acoesCol.classList.add('justify-end')

    const row = TableRow({ 
        cells: [ 
            { 
                content: nomeCol, 
                className: 'w-auto',
            }, 
            {
                content: matriculaOuProfessorCol,
                className: 'w-auto',
            }, 
            {
                content: arrayCol,
            }, 
            {
                content: acoesCol,
                className: 'w-1/100',
            }
        ] 
    })

    return row
}

export function TableHead(cells=[{ content: 'empty', className: '' }]) {
    const thead = document.createElement('thead')
    const headRow = document.createElement('tr')
    cells.forEach((cell) => {
        const headCol = document.createElement('th')
        const classStyle = cell.className ? cell.className : 'text-start'
        const content = Text({
            size: 'sm',
            text: cell.content,
            bold: 'regular',
            tone: 's-500',
            className: classStyle,
        })
        headCol.appendChild(content)
        headRow.appendChild(headCol)
    })

    thead.appendChild(headRow)

    return thead
}