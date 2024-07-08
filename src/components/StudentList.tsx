import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Pagination, Button, Modal } from 'antd';
import axios from 'axios';
import './estilos/StudentList.css';

const { Title } = Typography;

interface Horario {
  entrada: string;
  receso: number;
  salida: string;
}

interface Student {
  _id: string;
  matricula: string;
  correo: string;
  proyecto: string;
  horario: Horario;
}

interface Props {
  username: string;
}

const StudentList: React.FC<Props> = ({ username }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Tamaño de página
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const url = `https://entradas-backend.vercel.app/docentes/mat?matricula=${username}`;
        const response = await axios.get(url);

        if (response.data && response.data.alumnos) {
          setStudents(response.data.alumnos);
          console.log("hecho");
        } else {
          setError('No se encontraron alumnos para este docente');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error al obtener los datos de los alumnos');
      }
    };

    fetchStudents();
  }, [username]);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
  };

  const columns = [
    {
      title: 'Matrícula',
      dataIndex: 'matricula',
      key: 'matricula',
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Proyecto',
      dataIndex: 'proyecto',
      key: 'proyecto',
    },
    {
      title: 'Entrada',
      dataIndex: ['horario', 'entrada'],
      key: 'entrada',
    },
    {
      title: 'Receso',
      dataIndex: ['horario', 'receso'],
      key: 'receso',
    },
    {
      title: 'Salida',
      dataIndex: ['horario', 'salida'],
      key: 'salida',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text: string, record: Student) => (
        <Button onClick={() => handleStudentClick(record)}>Ver Datos</Button>
      ),
    },
  ];

  // Obtener datos de la página actual
  const paginatedStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="student-list-container">
      <Card bordered={false} style={{ width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Lista de Alumnos</Title>
        {error ? (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        ) : (
          <>
            <Table
              dataSource={paginatedStudents}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
            <Pagination
              style={{ textAlign: 'center', marginTop: '20px' }}
              current={currentPage}
              pageSize={pageSize}
              total={students.length}
              onChange={handlePageChange}
            />
          </>
        )}
      </Card>

      <Modal
        title="Datos del Alumno"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Cerrar
          </Button>,
        ]}
      >
        {selectedStudent && (
          <div>
            <p><strong>Nombre:</strong> {selectedStudent.matricula}</p>
            <p><strong>Apellido paterno:</strong></p>
            <p><strong>Apellido materno:</strong></p>
            <p><strong>Telefono:</strong></p>
            <p><strong>Domicilio:</strong></p>
            <ul>
              <li><strong>Estado:</strong> </li>
              <li><strong>Municipio:</strong> </li>
              <li><strong>Colonia:</strong> </li>
              <li><strong>Calle:</strong> </li>
              <li><strong>Numero exterior:</strong> </li>
              <li><strong>Numero interior:</strong> </li>
            </ul>
            <p><strong>Contacto de emergencia:</strong></p>
            <ul>
              <li><strong>Nombre:</strong> </li>
              <li><strong>Telefono:</strong> </li>
              <li><strong>Parentesco:</strong> </li>
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentList;
