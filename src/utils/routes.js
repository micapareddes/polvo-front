import { baseUrl } from "./baseUrl.js"

export const ROUTES = {
    LOGIN: '/src/pages/login/index.html',
    ERROR404: '/src/pages/404/index.html',
    ADMIN: {
        DASHBOARD: '/src/pages/admin/dashboard/index.html',
        PAINEL: {
            DISCIPLINAS: '/src/pages/admin/painel/disciplinas/index.html',
            ALUNOS: '/src/pages/admin/painel/alunos/index.html',
            PROFESSORES: '/src/pages/admin/painel/professores/index.html',
        },
        CADASTRO: {
            DISCIPLINAS: '/src/pages/admin/cadastro/disciplinas/index.html',
            ALUNOS: '/src/pages/admin/cadastro/alunos/index.html',
            PROFESSORES: '/src/pages/admin/cadastro/professores/index.html',
        },
        EDICAO: {
            DISCIPLINAS: (id) => `/src/pages/admin/edicao/disciplinas/index.html?id=${id}`,
            ALUNOS: (id) => `/src/pages/admin/edicao/alunos/index.html?id=${id}`,
            PROFESSORES: (id) => `/src/pages/admin/edicao/professores/index.html?id=${id}`,
            QUIZZES: (id) => `/src/pages/admin/edicao/quizzes/index.html?id=${id}`,
        },
    },
    ALUNO: {
        DASHBOARD: '/src/pages/aluno/dashboard/index.html',
        DISCIPLINA: (id) => `/src/pages/aluno/disciplina/index.html?id=${id}`,
        QUIZ: (id) => `/src/pages/aluno/quiz/index.html?step=1&id=${id}`,
        GABARITO: ({ quiz, tentativa }) => `/src/pages/aluno/gabarito/index.html?quiz=${quiz}&tentativa=${tentativa}`,
    },
    PROFESSOR: {
        DASHBOARD: '/src/pages/professor/dashboard/index.html',
        DISCIPLINA: (id) => `/src/pages/professor/disciplina/index.html?id=${id}`,
        QUIZ: {
            INFO: (id) => `/src/pages/professor/quiz/infos/index.html?id=${id}`,
            CREATE: '/src/pages/professor/quiz/create/index.html?step=1',
            EDIT: (id) => `/src/pages/professor/quiz/edicao/index.html?id=${id}`,
            RASCUNHO: (id) => `/src/pages/professor/quiz/create/index.html?step=1&id=${id}`,
            GABARITO: ({ quiz, tentativa }) => `/src/pages/professor/quiz/gabarito/index.html?quiz=${quiz}&tentativa=${tentativa}`,
        }
    },
}

export const API_ENDPOINTS = {
    LOGIN: `${baseUrl}/api/usuarios/login`,
    POST_USER: `${baseUrl}/api/usuarios`,
    POST_DISCIPLINA: `${baseUrl}/api/disciplinas`,
    POST_QUIZ: `${baseUrl}/api/quiz/new`,
    POST_RESPOSTA: (id) => `${baseUrl}/api/respostas/new/${id}`,

    GET_USER_TYPE: `${baseUrl}/api/usuarios/me`,
    GET_DISCIPLINAS: `${baseUrl}/api/disciplinas/cadastradas`,
    GET_DISCIPLINAS_SEM_PROFESSOR: `${baseUrl}/api/disciplinas/sem_professor`,
    GET_DISCIPLINA_NAME: (id) => `${baseUrl}/api/disciplinas/name/${id}`,
    GET_DISCIPLINA: (id) => `${baseUrl}/api/disciplinas/${id}`,
    GET_DISCIPLINA_BY_ID: (id) => `${baseUrl}/api/disciplinas/${id}`, //FIXME:
    GET_PERGUNTAS_QUIZ: (id) => `${baseUrl}/api/respostas/quiz/${id}`,
    GET_GABARITO: (id) => `${baseUrl}/api/respostas/gabarito/${id}`,
    EMBARALHA: (id) => `${baseUrl}/api/quiz/embaralha/${id}`,
    GET_QUIZ: (id) => `${baseUrl}/api/quiz/quiz/${id}`,
    GET_QUIZ_FOR_GABARITO_BY_ID: (id) => `${baseUrl}/api/quiz/questions_gabarito/${id}`,
    GET_QUIZ_INFO_FOR_STRUDENT_BY_ID: (id) => `${baseUrl}/api/quiz/student_infos/${id}`,
    GET_QUIZ_INFO_FOR_PROFESSOR_BY_ID: (id) => `${baseUrl}/api/quiz/professor_infos/${id}`,
    GET_QUIZ_INFO_BY_DISCIPLINA_ID: (id) => `${baseUrl}/api/disciplinas/quiz/${id}`,
    GET_QUIZZES_FOR_PROFESSOR_BY_DISCIPLINA_ID: (id) => `${baseUrl}/api/quiz/prof/disciplina/${id}`,

    PATCH_QUIZ: (id) => `${baseUrl}/api/quiz/${id}`,
    PATCH_ADICIONAR_QUIZ_A_DISCIPLINA: `${baseUrl}/api/disciplinas/quiz`,
    PATCH_DISCIPLINA_BY_ID: (id) => `${baseUrl}/api/disciplinas/editar/${id}`,
    PATCH_DISCIPLINA_POFESSOR_BY_ID: (id) => `${baseUrl}/api/disciplinas/professor/${id}`,
    PATCH_PROFESSORES_TO_DISCIPLINAS: `${baseUrl}/api/disciplinas`,

    GET_USER: (id) => `${baseUrl}/api/usuarios/user_data/${id}`,
    GET_USER_TYPE: `${baseUrl}/api/usuarios/me`,
    GET_USER_NAME: `${baseUrl}/api/usuarios/name`,
    GET_ALL_PROFESSORES_WITH_DISCIPLINAS: `${baseUrl}/api/usuarios/all_professores`,
    GET_DISCIPLINAS_PROFESSOR: `${baseUrl}/api/disciplinas/professor`,
    GET_DISCIPLINAS_ALUNO: `${baseUrl}/api/alunos_disciplinas/get`,
    PATCH_USER: (id) => `${baseUrl}/api/usuarios/user/${id}`,
    GET_PROFESSORES: `${baseUrl}/api/usuarios/professores`,
    GET_PROFESSOR_WITH_DISCIPLINA: (id) => `${baseUrl}/api/usuarios/professor_disciplina/${id}`,

    GET_ALL_STUDENTS_WITH_DISCIPLINAS: `${baseUrl}/api/alunos_disciplinas/all_students`,
    GET_STUDENT_WITH_DISCIPLINA: (id) => `${baseUrl}/api/alunos_disciplinas/student/${id}`,
    PATCH_STUDENT_DISCIPLINAS: (id) => `${baseUrl}/api/alunos_disciplinas/student/${id}`,
    POST_STUDENT_RELATIONS: `${baseUrl}/api/alunos_disciplinas`,

    DELETE_QUIZ: (id) => `${baseUrl}/api/quiz/quiz/${id}`,
    DELETE_USER: `${baseUrl}/api/usuarios`,
    DELETE_DISCIPLINA: `${baseUrl}/api/disciplinas`,
    DELETE_PROFESSOR_FROM_DISCIPLINA: `${baseUrl}/api/disciplinas/professor`,
    DELETE_RELATION_BY_DISCIPLINA_ID: `${baseUrl}/api/alunos_disciplinas/disciplina`,    
    DELETE_RELATION_BY_ALUNO_ID: `${baseUrl}/api/alunos_disciplinas/aluno`,
}