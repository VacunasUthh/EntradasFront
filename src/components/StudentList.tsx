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
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  domicilio?: {
    estado?: string;
    municipio?: string;
    colonia?: string;
    calle?: string;
    numero_exterior?: string;
    numero_interior?: string;
  };
  contacto_emergencia?: {
    nombre_c?: string;
    apellido_materno_c?: string;
    apellido_paterno_c?: string;
    telefono_c?: string;
    parentesco?: string;
  };
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
  const [noData, setNoData] = useState(false);

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

  const handleStudentClick = async (student: Student) => {
    try {
      const url = `https://entradas-backend.vercel.app/alumnos/${student.matricula}`;
      const response = await axios.get(url);

      if (response.data) {
        setSelectedStudent(response.data);
        setNoData(false);
        setIsModalVisible(true);
      } else {
        setNoData(true);
        setSelectedStudent(null);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al obtener los datos del alumno');
      setNoData(true);
      setSelectedStudent(null);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
    setNoData(false);
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
        {noData ? (
          <p>No se encontraron datos del alumno seleccionado.</p>
        ) : (
          selectedStudent && (
            <div>
              <p><strong>Nombre:</strong> {selectedStudent.nombre}</p>
              <p><strong>Apellido paterno:</strong> {selectedStudent.apellido_paterno}</p>
              <p><strong>Apellido materno:</strong> {selectedStudent.apellido_materno}</p>
              <p><strong>Telefono:</strong> {selectedStudent.telefono}</p>
              <p><strong>Domicilio:</strong></p>
              <ul>
                <li><strong>Estado:</strong> {selectedStudent.domicilio?.estado}</li>
                <li><strong>Municipio:</strong> {selectedStudent.domicilio?.municipio}</li>
                <li><strong>Colonia:</strong> {selectedStudent.domicilio?.colonia}</li>
                <li><strong>Calle:</strong> {selectedStudent.domicilio?.calle}</li>
                <li><strong>Numero exterior:</strong> {selectedStudent.domicilio?.numero_exterior}</li>
                <li><strong>Numero interior:</strong> {selectedStudent.domicilio?.numero_interior}</li>
              </ul>
              <p><strong>Contacto de emergencia:</strong></p>
              <ul>
                <li><strong>Nombre:</strong> {selectedStudent.contacto_emergencia?.nombre_c}</li>
                <li><strong>Apellido paterno:</strong> {selectedStudent.contacto_emergencia?.apellido_paterno_c}</li>
                <li><strong>Apellido materno:</strong> {selectedStudent.contacto_emergencia?.apellido_materno_c}</li>
                <li><strong>Telefono:</strong> {selectedStudent.contacto_emergencia?.telefono_c}</li>
                <li><strong>Parentesco:</strong> {selectedStudent.contacto_emergencia?.parentesco}</li>
              </ul>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default StudentList;
