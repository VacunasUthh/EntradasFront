import React, { useState, useEffect } from 'react';
import { Form, Button, TimePicker, Typography, Card, message, Row, Col } from 'antd';
import axios from 'axios';
import moment, { Moment } from 'moment';
import Select from 'react-select';
import './estilos/AssignSchedule.css';

const { Title } = Typography;

interface Horario {
  entrada: Moment;
  receso: Moment;
  salida: Moment;
}

interface Alumno {
  value: string;
  label: string;
}

interface Props {
  username: string;
}

const AssignSchedule: React.FC<Props> = ({ username }) => {
  const [loading, setLoading] = useState(false);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState<string[]>([]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get(`https://entradas-backend.vercel.app/docentes/mat?matricula=${username}`);
        const alumnosData = response.data.alumnos.map((alumno: any) => ({
          value: alumno.matricula,
          label: alumno.matricula,
        }));
        setAlumnos(alumnosData);
      } catch (error) {
        console.error('Error fetching alumnos:', error);
        message.error('Error al obtener los alumnos');
      }
    };

    fetchAlumnos();
  }, [username]);

  const onFinish = async (values: any) => {
    setLoading(true);

    const horarios = selectedAlumnos.map((alumnoId) => ({
      alumnoMatricula: alumnoId,
      horario: {
        entrada: values.entrada.format('HH:mm'),
        receso: values.receso.format('mm'), 
        salida: values.salida.format('HH:mm'),
      }
    }));

    try {
      const url = `https://entradas-backend.vercel.app/docentes/update-multiple-horarios/${username}`;
      const response = await axios.put(url, horarios);

      if (response.status === 200) {
        message.success('Horarios asignados con éxito');
        console.log(response.data);
      } else {
        message.error('Error al asignar los horarios');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al asignar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAlumnosChange = (selectedOptions: any) => {
    const alumnosIds = selectedOptions.map((option: any) => option.value);
    setSelectedAlumnos(alumnosIds);
  };

  return (
    <div className="assign-schedule-container">
      <Card bordered={false} className="assign-schedule-card">
        <Title level={2} className="assign-schedule-title">Asignar Horarios</Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            entrada: moment('08:00', 'HH:mm'),
            receso: moment('10:30', 'HH:mm'),
            salida: moment('14:00', 'HH:mm'),
          }}
          className="assign-schedule-form"
        >
          <Form.Item
            label="Alumnos"
            name="alumnos"
            rules={[{ required: true, message: 'Por favor, seleccione al menos un alumno' }]}
          >
            <Select
              isMulti
              name="alumnos"
              options={alumnos}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleAlumnosChange}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Hora de Entrada"
                name="entrada"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de entrada' }]}
              >
                <TimePicker format={'HH:mm'} />
              </Form.Item>

              <Form.Item
                label="Hora de Salida"
                name="salida"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de salida' }]}
              >
                <TimePicker format={'HH:mm'} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Receso"
                name="receso"
                rules={[{ required: true, message: 'Por favor, ingrese la hora de inicio del receso' }]}
              >
                <TimePicker format={'mm'} />
              </Form.Item>

            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="assign-schedule-button">
              Asignar Horarios
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AssignSchedule;
